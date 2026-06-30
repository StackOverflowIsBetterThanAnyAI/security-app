import { createContext, Dispatch, SetStateAction } from 'react'

type ContextImageRotationType = {
    imageRotation: string
    setImageRotation: Dispatch<SetStateAction<string>>
}

export const ContextImageRotation = createContext<
    ContextImageRotationType | undefined
>(undefined)
