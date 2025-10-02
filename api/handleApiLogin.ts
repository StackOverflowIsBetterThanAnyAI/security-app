type handleLoginProps = {
    setData: (value: any) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setLoginError: (value: React.SetStateAction<string>) => void
    url: string
}

export const handleApiLogin = async ({
    setData,
    setIsLoading,
    setIsLoggedIn,
    setLoginError,
    url,
}: handleLoginProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const json = await response.json()
        setData(json)

        setLoginError('')
        setIsLoggedIn(true)
    } catch (err: any) {
        setLoginError(err.message)
        setIsLoggedIn(false)
    } finally {
        setIsLoading(false)
    }
}
