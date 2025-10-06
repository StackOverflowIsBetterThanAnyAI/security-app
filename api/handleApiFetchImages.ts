import { Router } from 'expo-router'

type handleLoginProps = {
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setImages: React.Dispatch<React.SetStateAction<string[] | null>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setPage: React.Dispatch<React.SetStateAction<number>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    setTotalImages: React.Dispatch<React.SetStateAction<number>>
    url: string
    userToken: string
}

export const handleApiFetchImages = async ({
    router,
    setError,
    setImages,
    setIsLoading,
    setPage,
    setRetryFn,
    setTotalImages,
    url,
    userToken,
}: handleLoginProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${url}/images`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            const message = data.error || response.statusText || 'Unknown error'
            throw new Error(`Error ${response.status}: ${message}`)
        }
        const data: {
            images: string[]
            page: number
            total_images: number
        } = await response.json()
        setImages(data.images)
        setPage(data.page)
        setTotalImages(data.total_images)

        setError('')
        setRetryFn(() => {})
    } catch (err: any) {
        setError(err.message)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchImages({
                    router,
                    setError,
                    setImages,
                    setIsLoading,
                    setPage,
                    setRetryFn,
                    setTotalImages,
                    url,
                    userToken,
                })
            })
            router.push({
                pathname: '/error',
                params: { from: 'home' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
