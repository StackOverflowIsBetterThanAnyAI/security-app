import { StyleSheet, View } from 'react-native'

import FormSwitchButton from '@/components/form-switch-button'
import { useThemeColor } from '@/hooks/use-theme-color'

type FormSwitchProps = {
    handleClick: () => void | undefined
    isLoading: boolean
    isSigningUp: boolean
}

const FormSwitch = ({
    handleClick,
    isLoading,
    isSigningUp,
}: FormSwitchProps) => {
    const backgroundColor = useThemeColor({}, 'red')

    const styles = StyleSheet.create({
        switchWrapper: {
            alignSelf: 'center',
            backgroundColor,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 8,
        },
    })

    return (
        <View style={styles.switchWrapper}>
            <FormSwitchButton
                handleClick={handleClick}
                isLoading={isLoading}
                isSigningUp={isSigningUp}
                text="Login"
            />
            <FormSwitchButton
                handleClick={handleClick}
                isLoading={isLoading}
                isSigningUp={isSigningUp}
                isSignUpField
                text="Signup"
            />
        </View>
    )
}

export default FormSwitch
