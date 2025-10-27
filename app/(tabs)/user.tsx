import { useContext } from 'react'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import UserHeader from '@/components/user-header'
import UserSettings from '@/components/user-settings'
import { ContextUser } from '@/context/ContextUser'

const UserScreen = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('UserScreen must be used within a ContextUser.Provider')
    }
    const { userName, userRole } = contextUser

    return (
        <MainView>
            <UserHeader userName={userName} userRole={userRole} />
            {userRole === 'user' && (
                <ThemedText center>
                    Wait for an admin to promote you to Member.
                </ThemedText>
            )}
            <UserSettings />
        </MainView>
    )
}

export default UserScreen
