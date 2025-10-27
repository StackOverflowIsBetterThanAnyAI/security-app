import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import { memberProfile, userProfile } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
import { useThemeColor } from '@/hooks/use-theme-color'

const UserScreen = () => {
    const contextPage = useContext(ContextPage)
    if (!contextPage) {
        throw new Error('UserScreen must be used within a ContextPage.Provider')
    }
    const { setIsNextDisabled, setIsPreviousDisabled, setPage } = contextPage

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('UserScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userName, userRole } = contextUser

    const avatarColor = useThemeColor(
        { light: Colors.light.buttonInactive },
        'textLight'
    )
    const backgroundColorAvatar = useThemeColor(
        { light: Colors.light.textLight },
        'buttonInactive'
    )
    const backgroundColorButton = useThemeColor({}, 'background')
    const borderColorButton = useThemeColor({}, 'border')
    const router = useRouter()

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

    const styles = StyleSheet.create({
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
            paddingBottom: 16,
            paddingTop: 8,
        },
        button: {
            backgroundColor: backgroundColorButton,
            borderColor: borderColorButton,
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            minWidth: 144,
            paddingVertical: 8,
            paddingHorizontal: 24,
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
                    {userRole === 'user'
                        ? userProfile(avatarColor)
                        : memberProfile(avatarColor)}
                </View>
                <ThemedText center type="subtitle">
                    Role:{' '}
                    {userRole.substring(0, 1).toUpperCase() +
                        userRole.substring(1)}
                </ThemedText>
            </View>
            {userRole === 'user' && (
                <ThemedText center>
                    Wait for an admin to promote you to Member.
                </ThemedText>
            )}
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
        </MainView>
    )
}

export default UserScreen
