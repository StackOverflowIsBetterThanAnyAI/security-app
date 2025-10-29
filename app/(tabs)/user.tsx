import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { RefreshControl } from 'react-native'

import { handleApiFetchRole } from '@/api/handleApiFetchUserRole'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import UserHeader from '@/components/user-header'
import UserSettings from '@/components/user-settings'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

const UserScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'UserScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('UserScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userName, userRole, userToken, setUserRole } =
        contextUser

    const activityColor = useThemeColor({}, 'text')
    const router = useRouter()

    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)

    const handleFetchUserRole = useCallback(
        (setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
            handleApiFetchRole({
                router,
                setError,
                setIsLoading,
                setIsUserLoggedIn,
                setRetryFn,
                setUserRole,
                userToken,
            })
        },
        [
            router,
            setError,
            setIsUserLoggedIn,
            setRetryFn,
            setUserRole,
            userToken,
        ]
    )

    const handleFetchUserRoleManual = useCallback(() => {
        handleFetchUserRole()
    }, [handleFetchUserRole])

    const handleFetchUserRolePull = () => {
        handleFetchUserRole(setIsLoadingPull)
    }

    useFocusEffect(
        useCallback(() => {
            handleFetchUserRoleManual()
            const refresh = setInterval(() => {
                handleFetchUserRoleManual()
            }, 30000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleFetchUserRoleManual])
    )

    return (
        <MainView
            refreshControl={
                userRole === 'user' ? (
                    <RefreshControl
                        accessibilityLabel="Refreshing Role Status"
                        refreshing={isLoadingPull}
                        onRefresh={handleFetchUserRolePull}
                        tintColor={activityColor}
                    />
                ) : undefined
            }
        >
            <UserHeader userName={userName} userRole={userRole} />
            {userRole === 'user' && (
                <ThemedText center>
                    Wait for an admin to promote you to Member.
                </ThemedText>
            )}
            <UserSettings handleFetchUserRole={handleFetchUserRoleManual} />
        </MainView>
    )
}

export default UserScreen
