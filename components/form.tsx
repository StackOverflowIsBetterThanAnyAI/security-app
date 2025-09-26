import FormError from '@/components/form-error'
import FormInput from '@/components/form-input'
import FormSubmit from '@/components/form-submit'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import ThemedView from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

const Form = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [errorUserName, setErrorUserName] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')

    const userNameRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    const color = useThemeColor({}, 'red')

    const userNamePattern = useMemo(() => /^[a-z0-9]{5,20}$/i, [])
    const passwordPattern = useMemo(() => /^[^\s]{8,25}$/, [])

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
            <View>
                <FormInput
                    error={errorUserName}
                    handleSubmitEditing={() => passwordRef?.current?.focus()}
                    label="User Name"
                    password={{}}
                    pattern={userNamePattern}
                    placeholder="Michael"
                    ref={userNameRef}
                    returnKeyType="next"
                    setError={setErrorUserName}
                    setValue={setUserName}
                    submitBehavior="submit"
                    type="username"
                    value={userName}
                />
                <FormError error={errorUserName} />
                <FormInput
                    error={errorPassword}
                    handleSubmitEditing={
                        isSigningUp
                            ? () => confirmPasswordRef?.current?.focus()
                            : undefined
                    }
                    label="Password"
                    password={{
                        isPasswordVisible,
                        setIsPasswordVisible,
                        setConfirmPassword,
                        setErrorConfirmPassword,
                    }}
                    pattern={passwordPattern}
                    placeholder="password"
                    ref={passwordRef}
                    returnKeyType={isSigningUp ? 'next' : 'done'}
                    setError={setErrorPassword}
                    setValue={setPassword}
                    submitBehavior={isSigningUp ? 'submit' : 'blurAndSubmit'}
                    type="password"
                    value={password}
                />
                <FormError error={errorPassword} />
                {isSigningUp && (
                    <>
                        <FormInput
                            error={errorConfirmPassword}
                            label="Confirm Password"
                            password={{
                                enteredPassword: password,
                                isPasswordVisible,
                                setIsPasswordVisible,
                            }}
                            pattern={passwordPattern}
                            placeholder="password"
                            ref={confirmPasswordRef}
                            returnKeyType="done"
                            setError={setErrorConfirmPassword}
                            setValue={setConfirmPassword}
                            submitBehavior="blurAndSubmit"
                            type="confirmpassword"
                            value={confirmPassword}
                        />
                        <FormError error={errorConfirmPassword} />
                    </>
                )}
            </View>
            <FormSubmit
                isDisabled={
                    !errorConfirmPassword ||
                    !errorPassword ||
                    !errorUserName ||
                    !confirmPassword.length ||
                    !password.length ||
                    !userName.length
                }
                isSigningUp={isSigningUp}
            />
        </>
    )
}

export default Form
