import { URL, URL_MOBILE } from '@/constants/api'
import { clearData } from '@/helper/storeData'
import { Router } from 'expo-router'
import { Platform } from 'react-native'
import { handleApiFetchUsers, UsersType } from './handleApiFetchUsers'

type handleApiDeleteUserProps = {
    id: number
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    url: string
    userToken: string
}

export const handleApiDeleteUser = async ({
    id,
    router,
    setError,
    setIsLoading,
    setIsUserLoggedIn,
    setUsers,
    setRetryFn,
    url,
    userToken,
}: handleApiDeleteUserProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${url}/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                id: id,
            }),
        })

        if (!response.ok) {
            if (response.status === 403) {
                setIsUserLoggedIn(false)
                setError('')
                await clearData(['authToken', 'authRole', 'authName'])
                router.replace('/(tabs)/login')
                return
            }

            const data = await response.json().catch(() => ({}))
            const message = data.error || response.statusText || 'Unknown error'
            throw new Error(`Error ${response.status}: ${message}`)
        }

        handleApiFetchUsers({
            router,
            setError,
            setIsLoading,
            setIsUserLoggedIn,
            setRetryFn,
            setUsers,
            url: Platform.OS === 'web' ? URL : URL_MOBILE,
            userToken,
        })

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        setError(error.message)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiDeleteUser({
                    id,
                    router,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setUsers,
                    setRetryFn,
                    url,
                    userToken,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'admin' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
