import { createContext } from 'react'

export type UserRole = 'user' | 'member' | 'admin'

export type UserContextType = {
    isUserLoggedIn: boolean
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>

    userName: string
    setUserName: React.Dispatch<React.SetStateAction<string>>

    userRole: UserRole
    setUserRole: React.Dispatch<React.SetStateAction<UserRole>>

    userToken: string
    setUserToken: React.Dispatch<React.SetStateAction<string>>
}

export const ContextUser = createContext<UserContextType | undefined>(undefined)
