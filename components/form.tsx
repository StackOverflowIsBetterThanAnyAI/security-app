import FormInput from '@/components/form-input'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useRef, useState } from 'react'
import { TextInput } from 'react-native'

const Form = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)

    const userNameRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    const color = useThemeColor({}, 'red')

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
                <ThemedText style={{ color }}>*</ThemedText> are required.
            </ThemedText>
            <FormSwitch handleClick={handleClick} isSigningUp={isSigningUp} />
            <FormInput
                handleSubmitEditing={() => passwordRef?.current?.focus()}
                label="User Name"
                placeholder="Michael"
                ref={userNameRef}
                returnKeyType="next"
                submitBehavior="submit"
                type="default"
            />
            <FormInput
                handleSubmitEditing={
                    isSigningUp
                        ? () => confirmPasswordRef?.current?.focus()
                        : undefined
                }
                isPassword
                label="Password"
                placeholder="password"
                ref={passwordRef}
                returnKeyType={isSigningUp ? 'next' : 'done'}
                submitBehavior={isSigningUp ? 'submit' : 'blurAndSubmit'}
                type="default"
            />
            {isSigningUp && (
                <FormInput
                    isPassword
                    label="Confirm Password"
                    placeholder="password"
                    ref={confirmPasswordRef}
                    returnKeyType="done"
                    submitBehavior="blurAndSubmit"
                    type="default"
                />
            )}
        </>
    )
}

export default Form
