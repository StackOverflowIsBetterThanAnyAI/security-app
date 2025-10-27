import { createContext } from 'react'

export type UserRoleType = 'user' | 'member' | 'admin'

type UserContextType = {
    isUserLoggedIn: boolean
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>

    userName: string
    setUserName: React.Dispatch<React.SetStateAction<string>>

    userRole: UserRoleType
    setUserRole: React.Dispatch<React.SetStateAction<UserRoleType>>

    userToken: string
    setUserToken: React.Dispatch<React.SetStateAction<string>>
}

export const ContextUser = createContext<UserContextType | undefined>(undefined)
