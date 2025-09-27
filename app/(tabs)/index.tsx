import { StyleSheet } from 'react-native'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import ThemedView from '@/components/themed-view'

const IndexScreen = () => {
    return (
        <MainView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
            </ThemedView>
        </MainView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
})

export default IndexScreen
