import { Router } from 'expo-router'

import { ITEMS_PER_PAGE, URL } from '@/constants/api'
import { clearData } from '@/helper/storeData'

type handleApiFetchImagesProps = {
    page: number
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setImages: React.Dispatch<React.SetStateAction<string[] | null>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsNextDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setIsPreviousDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    setTotalImages: React.Dispatch<React.SetStateAction<number>>
    userToken: string
}

export const handleApiFetchImages = async ({
    page,
    router,
    setError,
    setImages,
    setIsLoading,
    setIsNextDisabled,
    setIsPreviousDisabled,
    setIsUserLoggedIn,
    setPage,
    setRetryFn,
    setTotalImages,
    userToken,
}: handleApiFetchImagesProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${URL}/images?page=${page}`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })

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
        const images: {
            images: string[]
            page: number
            total_images: number
        } = await response.json()

        setIsNextDisabled(
            images.page >= Math.ceil(images.total_images / ITEMS_PER_PAGE)
        )
        setIsPreviousDisabled(images.page <= 1)

        setImages(images.images)
        setPage(images.page)
        setTotalImages(images.total_images)

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
                    setIsNextDisabled,
                    setIsPreviousDisabled,
                    setIsUserLoggedIn,
                    setPage,
                    setRetryFn,
                    setTotalImages,
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
