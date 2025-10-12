import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import { noConnection } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { ContextError } from '@/context/ContextError'
import { useThemeColor } from '@/hooks/use-theme-color'

const ErrorScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'ErrorScreen must be used within a ContextError.Provider'
        )
    }
    const { error, retryFn, setError } = contextError

    const colorInput = useThemeColor({}, 'text')
    const router = useRouter()
    const { from } = useLocalSearchParams<{ from: string }>()

    const handleGoBack = () => {
        router.replace(`/${from}` as any)
        setError('')
    }

    const handleTryAgain = () => {
        if (retryFn) {
            retryFn()
        }
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
                    {error && error.length && (
                        <ThemedText center>{String(error)}</ThemedText>
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
