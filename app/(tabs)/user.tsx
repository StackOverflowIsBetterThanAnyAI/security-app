import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import UserHeader from '@/components/user-header'
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
        border: {
            borderBottomWidth: 2,
            borderBottomColor: borderColorButton,
            borderTopWidth: 2,
            borderTopColor: borderColorButton,
            marginHorizontal: 8,
            paddingBottom: 24,
            paddingTop: 16,
        },
    })

    return (
        <MainView>
            <UserHeader userName={userName} userRole={userRole} />
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
