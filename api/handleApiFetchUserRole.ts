import { Router } from 'expo-router'

import { API_TIMEOUT_MS, URL } from '@/constants/api'
import { UserRoleType } from '@/context/ContextUser'
import { clearData, saveData } from '@/helper/storeData'

type handleApiFetchRoleProps = {
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: ((value: React.SetStateAction<boolean>) => void) | undefined
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUserRole: React.Dispatch<React.SetStateAction<UserRoleType>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    userToken: string
}

export const handleApiFetchRole = async ({
    router,
    setError,
    setIsLoading,
    setIsUserLoggedIn,
    setUserRole,
    setRetryFn,
    userToken,
}: handleApiFetchRoleProps) => {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading && setIsLoading(true)
    try {
        const response = await fetch(`${URL}/user/role`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

        const data: { role: UserRoleType } = await response.json()
        await saveData({
            authRole: data.role,
        })
        setUserRole(data.role)

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
                handleApiFetchRole({
                    router,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setUserRole,
                    setRetryFn,
                    userToken,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'user' },
            })
        })
    } finally {
        setIsLoading && setIsLoading(false)
    }
}
