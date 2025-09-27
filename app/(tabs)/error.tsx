import { StyleSheet, View } from 'react-native'

import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'

const ErrorScreen = () => {
    return (
        <MainView>
            <View style={styles.titleContainer}>
                <ThemedText type="title">Error!</ThemedText>
            </View>
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

export default ErrorScreen
