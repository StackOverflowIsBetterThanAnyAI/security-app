import FormInput from '@/components/form-input'
import FormSubmit from '@/components/form-submit'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import ThemedView from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useRef, useState } from 'react'
import { TextInput } from 'react-native'

const Form = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

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
            <ThemedView>
                <ThemedText center>
                    {isSigningUp
                        ? 'Create a new account.'
                        : 'Log in with an existing account.'}
                </ThemedText>
                <ThemedText center>
                    All fields marked with{' '}
                    <ThemedText style={{ color }}>*</ThemedText> are required.
                </ThemedText>
            </ThemedView>
            <FormSwitch handleClick={handleClick} isSigningUp={isSigningUp} />
            <FormInput
                handleSubmitEditing={() => passwordRef?.current?.focus()}
                label="User Name"
                password={{}}
                placeholder="Michael"
                ref={userNameRef}
                returnKeyType="next"
                setValue={setUserName}
                submitBehavior="submit"
                value={userName}
            />
            <FormInput
                handleSubmitEditing={
                    isSigningUp
                        ? () => confirmPasswordRef?.current?.focus()
                        : undefined
                }
                label="Password"
                password={{
                    isPassword: true,
                    isPasswordVisible,
                    setIsPasswordVisible,
                }}
                placeholder="password"
                ref={passwordRef}
                returnKeyType={isSigningUp ? 'next' : 'done'}
                setValue={setPassword}
                submitBehavior={isSigningUp ? 'submit' : 'blurAndSubmit'}
                value={password}
            />
            {isSigningUp && (
                <FormInput
                    label="Confirm Password"
                    password={{
                        isPassword: true,
                        isPasswordVisible,
                        setIsPasswordVisible,
                    }}
                    placeholder="password"
                    ref={confirmPasswordRef}
                    returnKeyType="done"
                    setValue={setConfirmPassword}
                    submitBehavior="blurAndSubmit"
                    value={confirmPassword}
                />
            )}
            <FormSubmit isSigningUp={isSigningUp} />
        </>
    )
}

export default Form
