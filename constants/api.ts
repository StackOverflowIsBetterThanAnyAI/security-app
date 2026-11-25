const tailscaleUrl = process.env.EXPO_PUBLIC_API_URL

if (!tailscaleUrl) {
    throw new Error(
        'EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set the address of your Raspberry Pi.'
    )
}

export const TAILSCALE_URL = tailscaleUrl

export const LOCAL_URL = process.env.EXPO_PUBLIC_API_URL_LOCAL || null

export const HEALTH_SERVICE_NAME = 'security-backend'

export const LOCAL_PROBE_TIMEOUT_MS = 1500

export const LOCAL_PROBE_INTERVAL_MS = 30000

export const ITEMS_PER_PAGE = 36

export const API_TIMEOUT_MS = 10000
