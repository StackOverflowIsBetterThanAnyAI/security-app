import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Pressable, StyleSheet } from 'react-native'

type FormSubmitProps = {
    handleSubmit: () => void
    isDisabled: boolean
    isSigningUp: boolean
}

const FormSubmit = ({
    handleSubmit,
    isDisabled,
    isSigningUp,
}: FormSubmitProps) => {
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
            accessibilityState={{ disabled: isDisabled }}
            accessibilityLabel={`${isSigningUp ? 'Signup' : 'Login'}${
                isDisabled ? ', disabled' : ''
            }`}
            style={({ pressed }) => [
                styles.wrapper,
                isDisabled ? styles.disabled : styles.enabled,
                !isDisabled &&
                    pressed && {
                        opacity: 0.75,
                    },
            ]}
            onPress={!isDisabled ? handleSubmit : undefined}
        >
            <ThemedText isDisabled={isDisabled}>
                {isSigningUp ? 'Signup' : 'Login'}
            </ThemedText>
        </Pressable>
    )
}

export default FormSubmit
