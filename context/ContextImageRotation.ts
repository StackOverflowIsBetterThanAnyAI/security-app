import { createContext, Dispatch, SetStateAction } from 'react'

type ContextImageRotationType = {
    imageRotation: number
    setImageRotation: Dispatch<SetStateAction<number>>
}

export const ContextImageRotation = createContext<
    ContextImageRotationType | undefined
>(undefined)
