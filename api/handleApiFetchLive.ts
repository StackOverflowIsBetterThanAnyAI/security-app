import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS } from '@/constants/api'
import { getErrorMessage } from '@/helper/getErrorMessage'
import { clearData } from '@/helper/storeData'
import { apiFetch } from '@/utils/apiUrl'

type handleApiFetchLiveProps = {
    router: ImperativeRouter
    setError: (value: React.SetStateAction<string>) => void
    setImageName: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    userToken: string
}

export const handleApiFetchLive = async ({
    router,
    setError,
    setImageName,
    setIsLoading,
    setIsUserLoggedIn,
    setRetryFn,
    userToken,
}: handleApiFetchLiveProps) => {
    const controller = new AbortController()
    const signal = controller.signal

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    setIsLoading(true)
    try {
        const response = await apiFetch(`/live/meta`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            signal: signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok && response.status !== 404) {
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

        const data: { filename: string } = await response.json()
        if (response.status === 404) {
            setImageName('')
        } else {
            setImageName(data.filename)
        }

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        clearTimeout(timeoutId)

        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
        setImageName('')

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchLive({
                    router,
                    setError,
                    setImageName,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setRetryFn,
                    userToken,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'live' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
