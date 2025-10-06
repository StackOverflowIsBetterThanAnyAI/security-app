import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'

type FormSubmitProps = {
    handleSubmit: () => void
    isDisabled: boolean
    isLoading: boolean
    isSigningUp: boolean
}

const FormSubmit = ({
    handleSubmit,
    isDisabled,
    isLoading,
    isSigningUp,
}: FormSubmitProps) => {
    const activityColor = useThemeColor({}, 'text')
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'background')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')

    const styles = StyleSheet.create({
        disabled: {
            backgroundColor: backgroundColorInactive,
            borderColor: borderColorInactive,
        },
        enabled: {
            backgroundColor: backgroundColorActive,
            borderColor: borderColorActive,
        },
        wrapper: {
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            marginTop: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled || isLoading }}
            accessibilityLabel={`${isSigningUp ? 'Signup' : 'Login'}${
                isDisabled || isLoading ? ', disabled' : ''
            }`}
            style={({ pressed }) => [
                styles.wrapper,
                isDisabled || isLoading ? styles.disabled : styles.enabled,
                !isDisabled &&
                    !isLoading &&
                    pressed && {
                        opacity: 0.75,
                    },
            ]}
            onPress={!isDisabled && !isLoading ? handleSubmit : undefined}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={activityColor}
                    style={{ width: 64, height: 26 }}
                />
            ) : (
                <ThemedText
                    isDisabled={isDisabled}
                    center
                    style={{
                        width: 64,
                        height: 26,
                    }}
                >
                    {isSigningUp ? 'Signup' : 'Login'}
                </ThemedText>
            )}
        </Pressable>
    )
}

export default FormSubmit
