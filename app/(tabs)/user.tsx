import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { ContextUser } from '@/context/ContextUser'
import { clearData } from '@/helper/storeData'
import { useContext } from 'react'

const UserScreen = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('UserScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn } = contextUser

    const router = useRouter()

    const handleLogout = () => {
        setIsUserLoggedIn(false)
        clearData(['authToken', 'authRole', 'authName'])
        router.replace('/login')
    }

    return (
        <MainView>
            <ThemedText>User</ThemedText>
            <Pressable
                onPress={handleLogout}
                accessible={true}
                accessibilityRole="button"
            >
                <ThemedText>Logout</ThemedText>
            </Pressable>
        </MainView>
    )
}

export default UserScreen
