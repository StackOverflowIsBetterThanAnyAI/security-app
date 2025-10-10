import { Router } from 'expo-router'

import { UserRoleType } from '@/context/ContextUser'
import { clearData, saveData } from '@/helper/storeData'

type handleLoginProps = {
    isLogin?: boolean
    password: string
    router: Router
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setPassword: React.Dispatch<React.SetStateAction<string>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    setUserRole: React.Dispatch<React.SetStateAction<UserRoleType>>
    setUserToken: React.Dispatch<React.SetStateAction<string>>
    url: string
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
    url,
    userName,
}: handleLoginProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(
            `${url}/${isLogin ? 'login' : 'register'}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    password,
                }),
            }
        )

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
        router.replace('/(tabs)/home')
    } catch (err: any) {
        setError(err.message)
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
                    url,
                    userName,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'login' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
