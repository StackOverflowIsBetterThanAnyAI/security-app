import { clearData } from '@/helper/storeData'
import { Router } from 'expo-router'

type handleLoginProps = {
    page: number
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setImages: React.Dispatch<React.SetStateAction<string[] | null>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    setTotalImages: React.Dispatch<React.SetStateAction<number>>
    url: string
    userToken: string
}

export const handleApiFetchImages = async ({
    page,
    router,
    setError,
    setImages,
    setIsLoading,
    setIsUserLoggedIn,
    setPage,
    setRetryFn,
    setTotalImages,
    url,
    userToken,
}: handleLoginProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${url}/images?page=${page}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })

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
    } catch (error: any) {
        setError(error.message)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchImages({
                    page,
                    router,
                    setError,
                    setImages,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setPage,
                    setRetryFn,
                    setTotalImages,
                    url,
                    userToken,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'home' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
