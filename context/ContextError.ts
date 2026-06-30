import { createContext, Dispatch, SetStateAction } from 'react'

type ContextErrorType = {
    error: string
    setError: Dispatch<SetStateAction<string>>
    retryFn: (() => void) | null
    setRetryFn: Dispatch<SetStateAction<(() => void) | null>>
}

export const ContextError = createContext<ContextErrorType | undefined>(
    undefined
)
