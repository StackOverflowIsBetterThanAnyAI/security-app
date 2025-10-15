import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import LiveImage from '@/components/live-image'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { ContextUser } from '@/context/ContextUser'

const LiveScreen = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('LiveScreen must be used within a ContextUser.Provider')
    }
    const { userName } = contextUser

    return (
        <MainView>
            <View style={styles.titleContainer}>
                <ThemedText center type="title">
                    Welcome, {userName}!
                </ThemedText>
                <ThemedText type="title">Live Recording</ThemedText>
            </View>
            <LiveImage />
        </MainView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        gap: 24,
    },
})

export default LiveScreen
