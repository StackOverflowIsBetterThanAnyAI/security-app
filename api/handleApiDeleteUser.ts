import { ImperativeRouter } from 'expo-router'

import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import { API_TIMEOUT_MS } from '@/constants/api'
import { getErrorMessage } from '@/helper/getErrorMessage'
import { clearData } from '@/helper/storeData'
import { apiFetch } from '@/utils/apiUrl'

type handleApiDeleteUserProps = {
    id: number
    router: ImperativeRouter
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
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
    userToken,
}: handleApiDeleteUserProps) => {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await apiFetch(`/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                id: id,
            }),
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
        clearTimeout(timeoutId)

        const errorMessage = getErrorMessage(error)
        setError(errorMessage)

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
