import { saveData } from '@/helper/storeData'

type handleLoginProps = {
    isLogin?: boolean
    password: string
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setLoginError: (value: React.SetStateAction<string>) => void
    url: string
    userName: string
}

export const handleApiLogin = async ({
    isLogin = false,
    password,
    setIsLoading,
    setIsLoggedIn,
    setLoginError,
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
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data: { token: string; role: string } = await response.json()
        await saveData({ authToken: data.token, authRole: data.role })

        setLoginError('')
        setIsLoggedIn(true)
    } catch (err: any) {
        setLoginError(err.message)
        setIsLoggedIn(false)
    } finally {
        setIsLoading(false)
    }
}
