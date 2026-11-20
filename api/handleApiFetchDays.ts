import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS, URL } from '@/constants/api'
import { getErrorMessage } from '@/helper/getErrorMessage'
import { clearData } from '@/helper/storeData'

export type RecordingDay = {
    count: number
    date: string
    thumbnail: string
}

type handleApiFetchDaysProps = {
    router: ImperativeRouter
    setDays: React.Dispatch<React.SetStateAction<RecordingDay[] | null>>
    setError: (value: React.SetStateAction<string>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    userToken: string
}

export const handleApiFetchDays = async ({
    router,
    setDays,
    setError,
    setIsLoading,
    setIsUserLoggedIn,
    setRetryFn,
    userToken,
}: handleApiFetchDaysProps) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await fetch(`${URL}/days`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            signal: controller.signal,
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

        const data: { days: RecordingDay[] } = await response.json()
        setDays(data.days)

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        clearTimeout(timeoutId)

        const errorMessage = getErrorMessage(error)
        setError(errorMessage)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchDays({
                    router,
                    setDays,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setRetryFn,
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
