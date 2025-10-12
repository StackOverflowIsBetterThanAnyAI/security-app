import { UserRoleType } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
import { Router } from 'expo-router'

export type UsersType = {
    id: number
    name: string
    role: UserRoleType
}

type handleApiFetchUsersProps = {
    router: Router
    setError: (value: React.SetStateAction<string>) => void
    setUsers: (value: React.SetStateAction<UsersType[]>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setRetryFn: React.Dispatch<React.SetStateAction<(() => void) | null>>
    url: string
    userToken: string
}

export const handleApiFetchUsers = async ({
    router,
    setError,
    setUsers,
    setIsLoading,
    setIsUserLoggedIn,
    setRetryFn,
    url,
    userToken,
}: handleApiFetchUsersProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${url}/users`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })

        if (!response.ok) {
            if (response.status === 403) {
                setIsUserLoggedIn(false)
                setError('')
                await clearData(['authToken', 'authRole', 'authName'])
                router.replace('/')
                return
            }

            const data = await response.json().catch(() => ({}))
            const message = data.error || response.statusText || 'Unknown error'
            throw new Error(`Error ${response.status}: ${message}`)
        }
        const users: UsersType[] = await response.json()
        setUsers(users)

        setError('')
        setRetryFn(() => {})
    } catch (error: any) {
        setError(error.message)

        queueMicrotask(() => {
            setRetryFn(() => () => {
                handleApiFetchUsers({
                    router,
                    setError,
                    setUsers,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setRetryFn,
                    url,
                    userToken,
                })
            })
            router.push({
                pathname: '/(tabs)/error',
                params: { from: 'admin' },
            })
        })
    } finally {
        setIsLoading(false)
    }
}
