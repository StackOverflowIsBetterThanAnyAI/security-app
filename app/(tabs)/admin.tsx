import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useRef, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import Button from '@/components/button'
import { noUsers } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import SkeletonUserGrid from '@/components/skeleton-user-grid'
import ThemedText from '@/components/themed-text'
import UserGrid from '@/components/user-grid'
import UserHeader from '@/components/user-header'
import UserSettings from '@/components/user-settings'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useThemeColor } from '@/hooks/use-theme-color'

const AdminScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'AdminScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'AdminScreen must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const colorIcon = useThemeColor({}, 'text')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingInitially, setIsLoadingInitially] = useState<boolean>(true)
    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)
    const [users, setUsers] = useState<UsersType[]>([])

    const scrollRef = useRef<ScrollView>(null)

    const handleFetchUsers = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            handleApiFetchUsers({
                router,
                setError,
                setIsLoading,
                setIsUserLoggedIn,
                setRetryFn,
                setUsers,
                userToken,
            })
        },
        [router, setError, setIsUserLoggedIn, setRetryFn, setUsers, userToken]
    )

    const handleFetchUsersManual = useCallback(() => {
        handleFetchUsers(setIsLoading)
        setIsLoadingInitially(false)
    }, [handleFetchUsers, setIsLoading, setIsLoadingInitially])

    const handleFetchUsersPull = () => {
        handleFetchUsers(setIsLoadingPull)
    }

    useScrollToTop(scrollRef)

    useFocusEffect(
        useCallback(() => {
            handleFetchUsersManual()
        }, [handleFetchUsersManual])
    )

    const styles = StyleSheet.create({
        activityLoader: {
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        noUsersContainer: {
            alignItems: 'center',
            gap: 16,
            paddingBottom: 8,
        },
    })

    return (
        <MainView
            ref={scrollRef}
            refreshControl={
                <RefreshControl
                    accessibilityLabel="Refreshing Users"
                    refreshing={isLoadingPull}
                    onRefresh={handleFetchUsersPull}
                    tintColor={colorIcon}
                />
            }
        >
            <UserHeader userName={userName} userRole="admin" />
            {isLoading && isLoadingInitially && !users.length ? (
                <SkeletonUserGrid />
            ) : users.length ? (
                <>
                    <Button
                        accessibilityLabel="Refresh Users"
                        handlePress={handleFetchUsersManual}
                        label="Refresh"
                    />
                    <UserGrid setUsers={setUsers} users={users} />
                </>
            ) : (
                <View style={styles.noUsersContainer}>
                    {noUsers(colorIcon)}
                    <ThemedText center>
                        Currently, there are no other Users registered.
                    </ThemedText>
                    <Button
                        accessibilityLabel="Refresh Users"
                        handlePress={handleFetchUsersManual}
                        label="Refresh"
                    />
                </View>
            )}
            <UserSettings handleFetchUserRole={undefined} />
        </MainView>
    )
}

export default AdminScreen
