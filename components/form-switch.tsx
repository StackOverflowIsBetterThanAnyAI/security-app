import ThemedView from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Pressable, StyleSheet, Text } from 'react-native'

type FormSwitchProps = {
    handleClick: () => void
    isSigningUp: boolean
}

const FormSwitch = ({ handleClick, isSigningUp }: FormSwitchProps) => {
    const borderColor = useThemeColor({}, 'border')
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInctive = useThemeColor({}, 'redInactive')
    const textColorActive = useThemeColor({}, 'buttonActive')
    const textColorInactive = useThemeColor({}, 'buttonInactive')

    return (
        <ThemedView
            style={[
                styles.switchWrapper,
                { backgroundColor: backgroundColorActive },
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.buttonLogin,
                    pressed && styles.buttonPressed,
                    {
                        backgroundColor: isSigningUp
                            ? backgroundColorInctive
                            : backgroundColorActive,
                        borderColor: borderColor,
                    },
                ]}
                onPress={handleClick}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: isSigningUp
                                ? textColorInactive
                                : textColorActive,
                        },
                    ]}
                >
                    Login
                </Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles.buttonSignup,
                    pressed && styles.buttonPressed,
                    {
                        backgroundColor: isSigningUp
                            ? backgroundColorActive
                            : backgroundColorInctive,
                        borderColor: borderColor,
                    },
                ]}
                onPress={handleClick}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: isSigningUp
                                ? textColorActive
                                : textColorInactive,
                        },
                    ]}
                >
                    Signup
                </Text>
            </Pressable>
        </ThemedView>
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
    switchWrapper: {
        alignSelf: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default FormSwitch
