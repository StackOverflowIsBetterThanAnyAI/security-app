import { useThemeColor } from '@/hooks/use-theme-color'
import { Pressable, StyleSheet } from 'react-native'
import ThemedText from './themed-text'

type FormSubmitProps = {
    isSigningUp: boolean
}

const FormSubmit = ({ isSigningUp }: FormSubmitProps) => {
    const backgroundColor = useThemeColor({}, 'red')
    const borderColor = useThemeColor({}, 'border')

    const handleSubmit = () => {}

    const styles = StyleSheet.create({
        wrapper: {
            backgroundColor,
            borderColor,
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
            style={({ pressed }) => [
                styles.wrapper,
                pressed && {
                    opacity: 0.75,
                },
            ]}
            onPress={handleSubmit}
        >
            <ThemedText>{isSigningUp ? 'Signup' : 'Login'}</ThemedText>
        </Pressable>
    )
}

export default FormSubmit
