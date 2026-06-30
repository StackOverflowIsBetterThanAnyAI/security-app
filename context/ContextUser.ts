import { createContext, Dispatch, SetStateAction } from 'react'

export type UserRoleType = 'user' | 'member' | 'admin'

type UserContextType = {
    isUserLoggedIn: boolean
    setIsUserLoggedIn: Dispatch<SetStateAction<boolean>>

    userName: string
    setUserName: Dispatch<SetStateAction<string>>

    userRole: UserRoleType
    setUserRole: Dispatch<SetStateAction<UserRoleType>>

    userToken: string
    setUserToken: Dispatch<SetStateAction<string>>
}

export const ContextUser = createContext<UserContextType | undefined>(undefined)
