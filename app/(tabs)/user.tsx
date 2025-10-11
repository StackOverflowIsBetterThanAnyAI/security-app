import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
import { useThemeColor } from '@/hooks/use-theme-color'

const UserScreen = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('UserScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userName, userRole } = contextUser

    const avatarColor = useThemeColor({}, 'text')
    const backgroundColorAvatar = useThemeColor({}, 'buttonInactive')
    const backgroundColorButton = useThemeColor({}, 'background')
    const borderColorButton = useThemeColor({}, 'border')
    const router = useRouter()

    const handleLogout = () => {
        setIsUserLoggedIn(false)
        clearData(['authToken', 'authRole', 'authName'])
        router.replace('/login')
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
                    <IconSymbol name="person" size={128} color={avatarColor} />
                </View>
                <ThemedText center type="subtitle">
                    Role:{' '}
                    {userRole.substring(0, 1).toUpperCase() +
                        userRole.substring(1)}
                </ThemedText>
            </View>
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

export default UserScreen
