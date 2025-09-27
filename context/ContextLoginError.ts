import { createContext } from 'react'

export const ContextLoginError = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | ''
>('')
