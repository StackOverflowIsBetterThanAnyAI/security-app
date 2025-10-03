import { saveData } from '@/helper/storeData'

type handleLoginProps = {
    isLogin?: boolean
    password: string
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setLoginError: (value: React.SetStateAction<string>) => void
    setUserRole: React.Dispatch<
        React.SetStateAction<'user' | 'member' | 'admin'>
    >
    setUserToken: React.Dispatch<React.SetStateAction<string>>
    url: string
    userName: string
}

export const handleApiLogin = async ({
    isLogin = false,
    password,
    setIsLoading,
    setIsUserLoggedIn,
    setLoginError,
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
        const data: { token: string; role: 'user' | 'member' | 'admin' } =
            await response.json()
        await saveData({
            authName: userName,
            authRole: data.role,
            authToken: data.token,
        })
        setUserRole(data.role)
        setUserToken(data.token)

        setLoginError('')
        setIsUserLoggedIn(true)
    } catch (err: any) {
        setLoginError(err.message)
        setIsUserLoggedIn(false)
    } finally {
        setIsLoading(false)
    }
}
