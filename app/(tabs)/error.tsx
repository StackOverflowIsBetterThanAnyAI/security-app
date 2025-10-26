import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

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

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const activityColor = useThemeColor({}, 'text')
    const colorInput = useThemeColor({}, 'text')
    const router = useRouter()
    const { from } = useLocalSearchParams<{ from: string }>()

    const handleGoBack = () => {
        router.replace(`/${from}` as any)
        setError('')
    }

    const handleTryAgain = async () => {
        if (isLoading) {
            return
        }

        if (retryFn) {
            setIsLoading(true)
            try {
                await retryFn()
            } catch (error: any) {
                console.error('Action failed:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const styles = StyleSheet.create({
        buttonWrapper: { flexDirection: 'row', gap: 24 },
        loadingOverlay: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        titleContainer: {
            gap: 8,
        },
        wrapper: {
            alignItems: 'center',
            gap: 16,
            margin: 'auto',
        },
    })

    return (
        <MainView>
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator color={activityColor} size="large" />
                </View>
            ) : (
                <View style={styles.wrapper}>
                    <View style={styles.titleContainer}>
                        <ThemedText center type="title">
                            Oooops!
                        </ThemedText>
                        <ThemedText center type="subtitle">
                            An Error occurred!
                        </ThemedText>
                        {error && error.length && (
                            <ThemedText center>{error}</ThemedText>
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
            )}
        </MainView>
    )
}

export default ErrorScreen
