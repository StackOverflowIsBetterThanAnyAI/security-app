import { Router } from 'expo-router'

import { UserRoleType } from '@/context/ContextUser'
import { saveData } from '@/helper/storeData'

type handleLoginProps = {
    isLogin?: boolean
    password: string
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
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
    setError,
    setIsLoading,
    setIsUserLoggedIn,
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
            throw new Error(`Error ${response.status} ${response.statusText}`)
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

        setError('')
        setRetryFn(() => {})
        setIsUserLoggedIn(true)
        router.replace('/home')
    } catch (err: any) {
        setError(err.message)
        setIsUserLoggedIn(false)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiLogin({
                    isLogin,
                    password,
                    router,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setRetryFn,
                    setUserRole,
                    setUserToken,
                    url,
                    userName,
                })
            })
            router.push({
                pathname: '/error',
                params: { from: 'login' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
