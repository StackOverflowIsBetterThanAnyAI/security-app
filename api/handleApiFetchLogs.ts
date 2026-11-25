import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS } from '@/constants/api'
import { clearData } from '@/helper/storeData'
import { apiFetch } from '@/utils/apiUrl'

export type LogEntryType = {
    message: string
    priority: number
    time: number
}

type handleApiFetchLogsProps = {
    router: ImperativeRouter
    setError: (value: React.SetStateAction<string>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setLogs: React.Dispatch<React.SetStateAction<LogEntryType[] | null>>
    setLogsFailed: React.Dispatch<React.SetStateAction<boolean>>
    setLogsUpdatedAt: React.Dispatch<React.SetStateAction<Date | null>>
    userToken: string
}

export const handleApiFetchLogs = async ({
    router,
    setError,
    setIsUserLoggedIn,
    setLogs,
    setLogsFailed,
    setLogsUpdatedAt,
    userToken,
}: handleApiFetchLogsProps) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    try {
        const response = await apiFetch(`/admin/logs`, {
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
            return
        }

        if (!response.ok) {
            throw new Error(`Error ${response.status}`)
        }

        const data: { entries: LogEntryType[] } = await response.json()
        setLogs(data.entries)
        setLogsFailed(false)
        setLogsUpdatedAt(new Date())
    } catch {
        setLogsFailed(true)
    } finally {
        clearTimeout(timeoutId)
    }
}
