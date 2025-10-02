import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { noConnection } from '@/icons/icons'

type ErrorScreenProps = {
    error?: string
}

const ErrorScreen = ({ error }: ErrorScreenProps) => {
    const colorInput = useThemeColor({}, 'text')

    const handleGoBack = () => {
        /* TODO */
    }

    const handleTryAgain = () => {
        /* TODO */
    }

    return (
        <MainView>
            <View style={styles.wrapper}>
                <View style={styles.titleContainer}>
                    <ThemedText center type="title">
                        Oooops!
                    </ThemedText>
                    <ThemedText center type="subtitle">
                        An Error occurred!
                    </ThemedText>
                    {error && (
                        <ThemedText center type="subtitle">
                            {error}
                        </ThemedText>
                    )}
                </View>
                {noConnection(colorInput)}
                <View style={styles.buttonWrapper}>
                    <Button
                        accessibilityLabel="Try Again"
                        handlePress={handleTryAgain}
                        label="Try Again"
                    />
                    <Button
                        accessibilityLabel="Go Back"
                        handlePress={handleGoBack}
                        label="Go Back"
                    />
                </View>
            </View>
        </MainView>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: { flexDirection: 'row', gap: 24 },
    titleContainer: {
        gap: 8,
    },
    wrapper: {
        alignItems: 'center',
        gap: 16,
        margin: 'auto',
    },
})

export default ErrorScreen
