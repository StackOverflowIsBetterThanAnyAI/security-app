const apiUrl = process.env.EXPO_PUBLIC_API_URL

if (!apiUrl) {
    throw new Error(
        'EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set the address of your Raspberry Pi.'
    )
}

export const URL = apiUrl

export const ITEMS_PER_PAGE = 36

export const API_TIMEOUT_MS = 10000
