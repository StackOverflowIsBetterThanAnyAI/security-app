import { createContext } from 'react'

export const ContextIsLoginFailed = createContext<
    | [
          boolean | undefined,
          React.Dispatch<React.SetStateAction<boolean | undefined>>
      ]
    | undefined
>(undefined)
