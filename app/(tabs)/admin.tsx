import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { handleApiFetchUsers, UsersType } from '@/api/handleApiFetchUsers'
import Button from '@/components/button'
import IconSymbol, { noUsers } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import UserGrid from '@/components/user-grid'
import { ContextError } from '@/context/ContextError'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
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

    const avatarColor = useThemeColor({}, 'textLight')
    const backgroundColorAvatar = useThemeColor({}, 'buttonInactive')
    const backgroundColorButton = useThemeColor({}, 'background')
    const borderColorButton = useThemeColor({}, 'border')
    const colorIcon = useThemeColor({}, 'text')
    const router = useRouter()
    const tabBarHeight = useBottomTabBarHeight()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<UsersType[]>([])

    const handleFetchUsers = useCallback(() => {
        handleApiFetchUsers({
            router,
            setError,
            setIsLoading,
            setIsUserLoggedIn,
            setRetryFn,
            setUsers,
            userToken,
        })
    }, [
        router,
        setError,
        setIsLoading,
        setIsUserLoggedIn,
        setRetryFn,
        setUsers,
        userToken,
    ])

    const handleLogout = () => {
        setIsNextDisabled(true)
        setIsPreviousDisabled(true)
        setIsUserLoggedIn(false)
        setPage(1)
        clearData(['authToken', 'authRole', 'authName'])
        router.replace('/')
    }

    useFocusEffect(
        useCallback(() => {
            handleFetchUsers()
        }, [handleFetchUsers])
    )

    const styles = StyleSheet.create({
        activityLoader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
        },
        avatarContainer: {
            alignSelf: 'center',
            backgroundColor: backgroundColorAvatar,
            borderColor: avatarColor,
            borderRadius: 100,
            borderWidth: 6,
            padding: 8,
        },
        button: {
            backgroundColor: backgroundColorButton,
            borderColor: borderColorButton,
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            marginTop: 'auto',
            minWidth: 144,
            paddingVertical: 8,
            paddingHorizontal: 24,
        },
        noUsersContainer: {
            gap: 16,
            alignItems: 'center',
            marginTop: 24,
        },
        titleContainer: {
            flexDirection: 'column',
            gap: 24,
        },
    })

    return (
        <MainView>
            <View style={styles.titleContainer}>
                <ThemedText center type="title">
                    Welcome, {userName}!
                </ThemedText>
                <View style={styles.avatarContainer}>
                    <IconSymbol name="person" size={128} color={avatarColor} />
                </View>
                <ThemedText
                    center
                    type="subtitle"
                    style={{
                        borderBottomWidth: 2,
                        borderBottomColor: borderColorButton,
                        marginHorizontal: 8,
                        paddingBottom: 8,
                    }}
                >
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
                        handlePress={handleFetchUsers}
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
                        handlePress={handleFetchUsers}
                        label="Refresh"
                    />
                </View>
            )}
            <Pressable
                onPress={handleLogout}
                accessible={true}
                accessibilityRole="button"
                style={({ pressed }) => [
                    { opacity: pressed ? 0.75 : 1 },
                    styles.button,
                ]}
            >
                <ThemedText center>Logout</ThemedText>
            </Pressable>
        </MainView>
    )
}

export default AdminScreen
