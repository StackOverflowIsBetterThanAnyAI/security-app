import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'

import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type ButtonProps = {
    accessibilityLabel: string
    handlePress: () => Promise<void> | void
    label: string
}

const Button = ({ accessibilityLabel, handlePress, label }: ButtonProps) => {
    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleButtonPress = async () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        try {
            await handlePress()
        } catch (error: any) {
            console.error('Action failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            marginTop: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
            minWidth: 144,
        },
        disabled: {
            borderColor: borderColorInactive,
        },
        enabled: {
            borderColor: borderColorActive,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
            accessibilityLabel={`${accessibilityLabel}${
                isLoading ? ', disabled' : ''
            }`}
            style={({ pressed }) => [
                styles.button,
                isLoading ? styles.disabled : styles.enabled,
                !isLoading &&
                    pressed && {
                        opacity: 0.75,
                    },
            ]}
            onPress={!isLoading ? handleButtonPress : undefined}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={activityColor}
                    style={{ height: 26 }}
                />
            ) : (
                <ThemedText center style={{ height: 26 }}>
                    {label}
                </ThemedText>
            )}
        </Pressable>
    )
}

export default Button
