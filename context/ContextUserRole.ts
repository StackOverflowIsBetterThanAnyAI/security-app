import { createContext } from 'react'

export const ContextUserRole = createContext<
    [
        'user' | 'member' | 'admin',
        React.Dispatch<React.SetStateAction<'user' | 'member' | 'admin'>>
    ]
>(['user', () => {}])
