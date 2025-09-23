import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useState } from 'react'

const Form = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)

    const redColor = useThemeColor({}, 'red')

    const handleClick = () => {
        setIsSigningUp((prev) => !prev)
    }

    return (
        <>
            <ThemedText center type="title" accessibilityRole="header">
                {isSigningUp ? 'Signup' : 'Login'}
            </ThemedText>
            <ThemedText center>
                All fields marked with{' '}
                <ThemedText style={{ color: redColor }}>*</ThemedText> are
                required.
            </ThemedText>
            <FormSwitch handleClick={handleClick} isSigningUp={isSigningUp} />
        </>
    )
}

export default Form
