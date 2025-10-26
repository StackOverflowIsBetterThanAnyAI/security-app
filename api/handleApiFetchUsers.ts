import { Router } from 'expo-router'

import { API_TIMEOUT_MS, URL } from '@/constants/api'
import { UserRoleType } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'

export type UsersType = {
    id: number
    name: string
    role: UserRoleType
}

type handleApiFetchUsersProps = {
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setUsers: (value: React.SetStateAction<UsersType[]>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    userToken: string
}

export const handleApiFetchUsers = async ({
    router,
    setError,
    setUsers,
    setIsLoading,
    setIsUserLoggedIn,
    setRetryFn,
    userToken,
}: handleApiFetchUsersProps) => {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await fetch(`${URL}/users`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            signal: signal,
        })

        clearTimeout(timeoutId)

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
        const users: UsersType[] = await response.json()
        setUsers(users)

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        clearTimeout(timeoutId)

        const errorMessage =
            error.name === 'AbortError' || error.message.includes('Aborted')
                ? 'Response from Server took too long'
                : error.message
        setError(errorMessage)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchUsers({
                    router,
                    setError,
                    setUsers,
                    setIsLoading,
                    setIsUserLoggedIn,
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
