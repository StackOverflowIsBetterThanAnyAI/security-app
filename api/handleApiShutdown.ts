import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS, URL } from '@/constants/api'
import { clearData } from '@/helper/storeData'

type handleApiShutdownProps = {
    router: ImperativeRouter
    setError: (value: React.SetStateAction<string>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    userToken: string
}

export const handleApiShutdown = async ({
    router,
    setError,
    setIsUserLoggedIn,
    userToken,
}: handleApiShutdownProps): Promise<string | null> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    try {
        const response = await fetch(`${URL}/admin/shutdown`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            signal: controller.signal,
        })

        if (response.status === 403) {
            setIsUserLoggedIn(false)
            setError('')
            await clearData(['authToken', 'authRole', 'authName'])
            router.replace('/')
            return null
        }

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            return `Error ${response.status}: ${data.error || 'Unknown error'}`
        }

        return null
    } catch (error: any) {
        return error.name === 'AbortError' || error.message.includes('Aborted')
            ? 'Response from Server took too long'
            : error.message
    } finally {
        clearTimeout(timeoutId)
    }
}
