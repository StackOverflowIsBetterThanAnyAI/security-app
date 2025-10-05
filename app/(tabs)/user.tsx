import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { clearData } from '@/helper/storeData'

const UserScreen = () => {
    const router = useRouter()

    const handleLogout = () => {
        clearData(['authToken', 'authRole', 'authName'])
        router.replace('/login')
    }

    return (
        <MainView>
            <ThemedText>User</ThemedText>
            <Pressable onPress={handleLogout}>
                <ThemedText>Logout</ThemedText>
            </Pressable>
        </MainView>
    )
}

export default UserScreen
