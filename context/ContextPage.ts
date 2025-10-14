import { createContext, Dispatch, SetStateAction } from 'react'

type ContextPageType = {
    isNextDisabled: boolean
    setIsNextDisabled: Dispatch<React.SetStateAction<boolean>>

    isPreviousDisabled: boolean
    setIsPreviousDisabled: Dispatch<React.SetStateAction<boolean>>

    page: number
    setPage: Dispatch<SetStateAction<number>>
}

export const ContextPage = createContext<ContextPageType | undefined>(undefined)
