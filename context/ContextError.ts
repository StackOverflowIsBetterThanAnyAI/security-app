import { createContext } from 'react'

type ContextErrorType = {
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>
    retryFn: (() => void) | null
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
}

export const ContextError = createContext<ContextErrorType | undefined>(
    undefined
)
