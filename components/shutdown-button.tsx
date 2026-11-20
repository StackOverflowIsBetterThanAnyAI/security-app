import { useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { handleApiShutdown } from '@/api/handleApiShutdown'
import ThemedText from '@/components/themed-text'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

type ShutdownStatus = 'idle' | 'confirming' | 'loading' | 'done'

const CONFIRM_TIMEOUT_MS = 3000

const ShutdownButton = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'ShutdownButton must be used within a ContextError.Provider'
        )
    }
    const { setError } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'ShutdownButton must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userToken } = contextUser

    const router = useRouter()

    const activityColor = useThemeColor({}, 'text')
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const warningColor = useThemeColor({}, 'red')

    const [status, setStatus] = useState<ShutdownStatus>('idle')
    const [shutdownError, setShutdownError] = useState<string>('')

    const isDisabled = status === 'loading' || status === 'done'

    useEffect(() => {
        if (status !== 'confirming') {
            return
        }
        const timeoutId = setTimeout(() => {
            setStatus('idle')
        }, CONFIRM_TIMEOUT_MS)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [status])

    const handlePress = async () => {
        if (status === 'idle') {
            setShutdownError('')
            setStatus('confirming')
            return
        }
        if (status !== 'confirming') {
            return
        }

        setStatus('loading')
        const errorMessage = await handleApiShutdown({
            router,
            setError,
            setIsUserLoggedIn,
            userToken,
        })
        if (errorMessage) {
            setShutdownError(errorMessage)
            setStatus('idle')
            return
        }
        setStatus('done')
    }

    const label =
        status === 'confirming'
            ? 'Confirm Shutdown'
            : status === 'done'
              ? 'Shutting Down'
              : 'Shutdown Pi'

    const styles = StyleSheet.create({
        border: {
            borderTopColor: borderColor,
            borderTopWidth: 2,
            gap: 8,
            marginBottom: -8,
            marginHorizontal: 8,
            paddingVertical: 16,
        },
        disabled: {
            backgroundColor: backgroundColorInactive,
            borderColor: borderColorInactive,
        },
        enabled: {
            backgroundColor: backgroundColorActive,
            borderColor,
        },
        error: {
            color: warningColor,
        },
        wrapper: {
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            marginTop: 8,
            minWidth: 144,
            paddingHorizontal: 24,
            paddingVertical: 8,
        },
    })

    return (
        <View style={styles.border}>
            <Pressable
                accessible={true}
                accessibilityHint={
                    status === 'confirming'
                        ? 'Tap again to shut down the Raspberry Pi'
                        : undefined
                }
                accessibilityLabel={`${label}${isDisabled ? ', disabled' : ''}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: isDisabled }}
                onPress={!isDisabled ? handlePress : undefined}
                style={({ pressed }) => [
                    styles.wrapper,
                    isDisabled ? styles.disabled : styles.enabled,
                    !isDisabled && pressed && { opacity: 0.75 },
                ]}
            >
                {status === 'loading' ? (
                    <ActivityIndicator
                        color={activityColor}
                        style={{ height: 26 }}
                    />
                ) : (
                    <ThemedText
                        center
                        isDisabled={isDisabled}
                        style={{ height: 26 }}
                    >
                        {label}
                    </ThemedText>
                )}
            </Pressable>
            {status === 'done' && (
                <ThemedText accessibilityLiveRegion="polite" center>
                    The Raspberry Pi is shutting down. Wait until the green LED
                    stays off before unplugging it.
                </ThemedText>
            )}
            {shutdownError !== '' && (
                <ThemedText
                    accessibilityLiveRegion="polite"
                    center
                    style={styles.error}
                >
                    {shutdownError}
                </ThemedText>
            )}
        </View>
    )
}

export default ShutdownButton
