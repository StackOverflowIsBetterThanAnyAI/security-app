import { ImperativeRouter } from 'expo-router'

import { API_TIMEOUT_MS } from '@/constants/api'
import { clearData } from '@/helper/storeData'
import { apiFetch } from '@/utils/apiUrl'

type ImageFolderStats = {
    count: number
    newest_age_seconds: number | null
}

export type SystemStatsType = {
    archive: ImageFolderStats & { max: number }
    cpu_temperature: number | null
    disk: { free: number; total: number } | null
    live: ImageFolderStats
    load_average: number[] | null
    memory: {
        available: number
        swap_free: number
        swap_total: number
        total: number
    } | null
    throttling: {
        throttled_now: boolean
        throttled_occurred: boolean
        under_voltage_now: boolean
        under_voltage_occurred: boolean
    } | null
    uptime_seconds: number | null
}

type handleApiFetchStatsProps = {
    router: ImperativeRouter
    setError: (value: React.SetStateAction<string>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setStats: React.Dispatch<React.SetStateAction<SystemStatsType | null>>
    setStatsFailed: React.Dispatch<React.SetStateAction<boolean>>
    setStatsUpdatedAt: React.Dispatch<React.SetStateAction<Date | null>>
    userToken: string
}

export const handleApiFetchStats = async ({
    router,
    setError,
    setIsUserLoggedIn,
    setStats,
    setStatsFailed,
    setStatsUpdatedAt,
    userToken,
}: handleApiFetchStatsProps) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, API_TIMEOUT_MS)

    try {
        const response = await apiFetch(`/admin/stats`, {
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

        const stats: SystemStatsType = await response.json()
        setStats(stats)
        setStatsFailed(false)
        setStatsUpdatedAt(new Date())
    } catch {
        setStatsFailed(true)
    } finally {
        clearTimeout(timeoutId)
    }
}
