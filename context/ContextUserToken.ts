import { createContext } from 'react'

export const ContextUserToken = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | ''
>('')
