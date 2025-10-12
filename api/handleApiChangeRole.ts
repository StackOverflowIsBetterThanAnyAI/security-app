import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import { URL, URL_MOBILE } from '@/constants/api'
import { clearData } from '@/helper/storeData'
import { Router } from 'expo-router'
import { Platform } from 'react-native'

type handleApiChangeRoleProps = {
    id: number
    role: 'user' | 'member'
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    url: string
    userToken: string
}

export const handleApiChangeRole = async ({
    id,
    role,
    router,
    setError,
    setIsLoading,
    setIsUserLoggedIn,
    setUsers,
    setRetryFn,
    url,
    userToken,
}: handleApiChangeRoleProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${url}/user/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                id: id,
                role: role,
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
                handleApiChangeRole({
                    id,
                    role,
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
