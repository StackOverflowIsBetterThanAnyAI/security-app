import { Router } from 'expo-router'

import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import { URL } from '@/constants/api'
import { clearData } from '@/helper/storeData'

type handleApiChangeRoleProps = {
    id: number
    role: 'user' | 'member'
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
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
    userToken,
}: handleApiChangeRoleProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${URL}/user/role`, {
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
                router.replace('/')
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
