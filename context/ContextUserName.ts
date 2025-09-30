import { createContext } from 'react'

export const ContextUserName = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | ''
>('')
