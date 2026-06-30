import { createContext, Dispatch, SetStateAction } from 'react'

type ContextPageType = {
    isNextDisabled: boolean
    setIsNextDisabled: Dispatch<SetStateAction<boolean>>

    isPreviousDisabled: boolean
    setIsPreviousDisabled: Dispatch<SetStateAction<boolean>>

    page: number
    setPage: Dispatch<SetStateAction<number>>
}

export const ContextPage = createContext<ContextPageType | undefined>(undefined)
