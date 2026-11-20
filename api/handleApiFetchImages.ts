import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS, ITEMS_PER_PAGE, URL } from '@/constants/api'
import { getErrorMessage } from '@/helper/getErrorMessage'
import { clearData } from '@/helper/storeData'

type handleApiFetchImagesProps = {
    day: string
    page: number
    router: ImperativeRouter
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
    day,
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
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await fetch(`${URL}/images?day=${day}&page=${page}`, {
            headers: {
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

        setPage(() => {
            if (images.page <= 1) {
                return 1
            }
            if (images.page > Math.ceil(images.total_images / ITEMS_PER_PAGE)) {
                return Math.ceil(images.total_images / ITEMS_PER_PAGE)
            }
            return images.page
        })
        setTotalImages(images.total_images)

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        clearTimeout(timeoutId)

        const errorMessage = getErrorMessage(error)
        setError(errorMessage)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchImages({
                    day,
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
                params: { from: 'gallery' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
