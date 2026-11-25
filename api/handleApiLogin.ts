import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS } from '@/constants/api'
import { UserRoleType } from '@/context/ContextUser'
import { getErrorMessage } from '@/helper/getErrorMessage'
import { clearData, saveData } from '@/helper/storeData'
import { apiFetch } from '@/utils/apiUrl'

type handleApiLoginProps = {
    isLogin?: boolean
    password: string
    router: ImperativeRouter
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setPassword: React.Dispatch<React.SetStateAction<string>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    setUserRole: React.Dispatch<React.SetStateAction<UserRoleType>>
    setUserToken: React.Dispatch<React.SetStateAction<string>>
    userName: string
}

export const handleApiLogin = async ({
    isLogin = false,
    password,
    router,
    setConfirmPassword,
    setError,
    setIsLoading,
    setIsUserLoggedIn,
    setPassword,
    setRetryFn,
    setUserRole,
    setUserToken,
    userName,
}: handleApiLoginProps) => {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await apiFetch(`/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                password,
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

        const data: { token: string; role: UserRoleType } =
            await response.json()
        await saveData({
            authName: userName,
            authRole: data.role,
            authToken: data.token,
        })
        setUserRole(data.role)
        setUserToken(data.token)

        setConfirmPassword('')
        setError('')
        setIsUserLoggedIn(true)
        setPassword('')
        setRetryFn(() => {})
    } catch (error: any) {
        clearTimeout(timeoutId)

        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
        setIsUserLoggedIn(false)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiLogin({
                    isLogin,
                    password,
                    router,
                    setConfirmPassword,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setPassword,
                    setRetryFn,
                    setUserRole,
                    setUserToken,
                    userName,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: '' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
