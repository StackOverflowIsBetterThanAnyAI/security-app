import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useRef, useState } from 'react'
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import Button from '@/components/button'
import IconSymbol, { noUsers } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import UserGrid from '@/components/user-grid'
import { Colors } from '@/constants/theme'
import { ContextError } from '@/context/ContextError'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
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

    const contextPage = useContext(ContextPage)
    if (!contextPage) {
        throw new Error(
            'AdminScreen must be used within a ContextPage.Provider'
        )
    }
    const { setIsNextDisabled, setIsPreviousDisabled, setPage } = contextPage

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'AdminScreen must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const avatarColor = useThemeColor(
        { light: Colors.light.buttonInactive },
        'textLight'
    )
    const backgroundColorAvatar = useThemeColor(
        { light: Colors.light.textLight },
        'buttonInactive'
    )
    const borderColorButton = useThemeColor({}, 'border')
    const colorIcon = useThemeColor({}, 'text')
    const router = useRouter()
    const tabBarHeight = useBottomTabBarHeight()

    const [isLoading, setIsLoading] = useState<boolean>(true)
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
    }, [handleFetchUsers, setIsLoading])

    const handleFetchUsersPull = () => {
        handleFetchUsers(setIsLoadingPull)
    }

    const handleLogout = () => {
        setIsNextDisabled(true)
        setIsPreviousDisabled(true)
        setIsUserLoggedIn(false)
        setPage(1)
        clearData(['authToken', 'authRole', 'authName'])
        router.replace('/')
    }

    const handleOpenLicense = () => {
        router.push('/(modals)/license')
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
        avatarContainer: {
            alignSelf: 'center',
            backgroundColor: backgroundColorAvatar,
            borderColor: avatarColor,
            borderRadius: 100,
            borderWidth: 6,
            padding: 8,
        },
        border: {
            borderBottomWidth: 2,
            borderBottomColor: borderColorButton,
            borderTopWidth: 2,
            borderTopColor: borderColorButton,
            marginHorizontal: 8,
            paddingBottom: 24,
            paddingTop: 16,
        },
        borderBottom: {
            borderBottomWidth: 2,
            borderBottomColor: borderColorButton,
            marginHorizontal: 8,
            paddingBottom: 16,
        },
        noUsersContainer: {
            alignItems: 'center',
            gap: 16,
            paddingBottom: 8,
        },
        titleContainer: {
            flexDirection: 'column',
            gap: 24,
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
            <View style={styles.titleContainer}>
                <ThemedText center type="title">
                    Welcome, {userName}!
                </ThemedText>
                <View style={styles.avatarContainer}>
                    <IconSymbol name="person" size={128} color={avatarColor} />
                </View>
                <ThemedText center type="subtitle" style={styles.borderBottom}>
                    Role: Admin
                </ThemedText>
            </View>
            {isLoading && !users.length ? (
                <View
                    style={[styles.activityLoader, { bottom: -tabBarHeight }]}
                >
                    <ActivityIndicator size="large" color={colorIcon} />
                </View>
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
            {!(isLoading && !users.length) && (
                <>
                    <View style={styles.border}>
                        <Button
                            accessibilityLabel="License"
                            handlePress={handleOpenLicense}
                            label="License"
                        />
                    </View>
                    <Button
                        accessibilityLabel="Logout"
                        handlePress={handleLogout}
                        label="Logout"
                    />
                </>
            )}
        </MainView>
    )
}

export default AdminScreen
