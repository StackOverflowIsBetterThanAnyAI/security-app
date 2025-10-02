import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from '@/components/button'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { ContextLoginError } from '@/context/ContextLoginError'
import { useThemeColor } from '@/hooks/use-theme-color'
import { noConnection } from '@/icons/icons'

const ErrorScreen = () => {
    const contextLoginError = useContext(ContextLoginError)
    if (!contextLoginError) {
        throw new Error(
            'ErrorScreen must be used within a ContextLoginError.Provider'
        )
    }
    const [loginError, setLoginError] = contextLoginError

    const colorInput = useThemeColor({}, 'text')

    const handleGoBack = () => {
        /* TODO */
        setLoginError('')
    }

    const handleTryAgain = () => {
        /* TODO */
        setLoginError('')
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
                    {loginError && <ThemedText center>{loginError}</ThemedText>}
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
