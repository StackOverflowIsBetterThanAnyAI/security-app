import { useThemeColor } from '@/hooks/use-theme-color'
import { Pressable, StyleSheet, Text } from 'react-native'

type FormSwitchProps = {
    handleClick: () => void
    isSigningUp: boolean
    isSignUpField?: boolean
    text: string
}

const FormSwitchButton = ({
    handleClick,
    isSignUpField = false,
    isSigningUp,
    text,
}: FormSwitchProps) => {
    const borderColor = useThemeColor({}, 'border')
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'redInactive')
    const textColorActive = useThemeColor({}, 'buttonActive')
    const textColorInactive = useThemeColor({}, 'buttonInactive')

    const backgroundColor =
        isSignUpField === isSigningUp
            ? backgroundColorActive
            : backgroundColorInactive

    const textColor =
        isSignUpField === isSigningUp ? textColorActive : textColorInactive

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.button,
                isSignUpField ? styles.buttonSignup : styles.buttonLogin,
                pressed && styles.buttonPressed,
                {
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                },
            ]}
            onPress={handleClick}
        >
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderWidth: 2,
    },
    buttonLogin: {
        backgroundColor: '#007AFF',
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
        borderRightWidth: 0,
    },
    buttonSignup: {
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12,
        borderLeftWidth: 0,
    },
    buttonPressed: {
        opacity: 0.75,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default FormSwitchButton
