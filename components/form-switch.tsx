import FormSwitchButton from '@/components/form-switch-button'
import ThemedView from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { StyleSheet } from 'react-native'

type FormSwitchProps = {
    handleClick: () => void
    isSigningUp: boolean
}

const FormSwitch = ({ handleClick, isSigningUp }: FormSwitchProps) => {
    const backgroundColor = useThemeColor({}, 'red')

    const styles = StyleSheet.create({
        switchWrapper: {
            alignSelf: 'center',
            backgroundColor,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
    })

    return (
        <ThemedView style={styles.switchWrapper}>
            <FormSwitchButton
                handleClick={handleClick}
                isSigningUp={isSigningUp}
                text="Login"
            />
            <FormSwitchButton
                handleClick={handleClick}
                isSigningUp={isSigningUp}
                isSignUpField
                text="Signup"
            />
        </ThemedView>
    )
}

export default FormSwitch
