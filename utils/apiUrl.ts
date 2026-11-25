import { useEffect, useSyncExternalStore } from 'react'
import { AppState } from 'react-native'

import {
    HEALTH_SERVICE_NAME,
    LOCAL_PROBE_INTERVAL_MS,
    LOCAL_PROBE_TIMEOUT_MS,
    LOCAL_URL,
    TAILSCALE_URL,
} from '@/constants/api'

let currentUrl = TAILSCALE_URL
let pendingProbe: Promise<string> | null = null
const listeners = new Set<() => void>()

export const getApiUrl = () => currentUrl

const setApiUrl = (url: string) => {
    if (url === currentUrl) {
        return
    }
    currentUrl = url
    listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

// re-renders the component when the app switches between home network and Tailscale
export const useApiUrl = () => useSyncExternalStore(subscribe, getApiUrl)

const isLocalReachable = async (localUrl: string) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, LOCAL_PROBE_TIMEOUT_MS)

    try {
        const response = await fetch(`${localUrl}/health`, {
            signal: controller.signal,
        })
        if (!response.ok) {
            return false
        }
        const data: { service?: string } = await response.json()
        return data.service === HEALTH_SERVICE_NAME
    } catch {
        return false
    } finally {
        clearTimeout(timeoutId)
    }
}

// prefers the home network address and falls back to Tailscale
export const resolveApiUrl = () => {
    const localUrl = LOCAL_URL
    if (!localUrl) {
        return Promise.resolve(currentUrl)
    }
    if (!pendingProbe) {
        pendingProbe = isLocalReachable(localUrl)
            .then((reachable) => {
                setApiUrl(reachable ? localUrl : TAILSCALE_URL)
                return currentUrl
            })
            .finally(() => {
                pendingProbe = null
            })
    }
    return pendingProbe
}

export const apiFetch = async (path: string, init?: RequestInit) => {
    try {
        return await fetch(`${getApiUrl()}${path}`, init)
    } catch (error: unknown) {
        resolveApiUrl()
        throw error
    }
}

// keeps the address up to date while the app is in the foreground
export const useApiUrlMonitor = () => {
    useEffect(() => {
        if (!LOCAL_URL) {
            return
        }
        const interval = setInterval(() => {
            if (AppState.currentState === 'active') {
                resolveApiUrl()
            }
        }, LOCAL_PROBE_INTERVAL_MS)
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                resolveApiUrl()
            }
        })
        return () => {
            clearInterval(interval)
            subscription.remove()
        }
    }, [])
}

// archive images never change, so their cache entry is shared by both addresses
export const imageCacheKey = (uri: string) =>
    uri.replace(/^https?:\/\/[^/]+/, '')
