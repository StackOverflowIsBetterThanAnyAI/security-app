import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useRouter } from 'expo-router'
import { useContext } from 'react'

type UserSettingsPropS = { handleFetchUserRole: (() => void) | undefined }

const UserSettings = ({ handleFetchUserRole }: UserSettingsPropS) => {
    const contextPage = useContext(ContextPage)
    if (!contextPage) {
        throw new Error(
            'UserSettings must be used within a ContextPage.Provider'
        )
    }
    const { setIsNextDisabled, setIsPreviousDisabled, setPage } = contextPage

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'UserSettings must be used within a ContextUser.Provider'
        )
    }
    const { userRole, setIsUserLoggedIn } = contextUser

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
            borderBottomColor: borderColorButton,
            borderTopWidth: 2,
            borderTopColor: borderColorButton,
            marginBottom: -8,
            marginHorizontal: 8,
            paddingVertical: 16,
        },
    })

    return (
        <>
            {userRole === 'user' && handleFetchUserRole && (
                <View style={styles.border}>
                    <Button
                        handlePress={handleFetchUserRole}
                        accessibilityLabel="Refresh Role Status"
                        label="Refresh"
                    />
                </View>
            )}
            <View style={styles.border}>
                <Button
                    accessibilityLabel="License"
                    handlePress={handleOpenLicense}
                    label="License"
                />
            </View>
            <View style={styles.border}>
                <Button
                    accessibilityLabel="Logout"
                    handlePress={handleLogout}
                    label="Logout"
                />
            </View>
        </>
    )
}
export default UserSettings
