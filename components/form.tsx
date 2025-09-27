import FormError from '@/components/form-error'
import FormInput from '@/components/form-input'
import FormSubmit from '@/components/form-submit'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import ThemedView from '@/components/themed-view'
import { ContextIsLoggedIn } from '@/context/ContextLogin'
import { ContextLoginError } from '@/context/ContextLoginError'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useContext, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

const Form = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error(
            'TabLayout must be used within a ContextIsLoggedIn.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const contextLoginError = useContext(ContextLoginError)
    if (!contextLoginError) {
        throw new Error(
            'TabLayout must be used within a ContextLoginError.Provider'
        )
    }
    const [_loginError, setLoginError] = contextLoginError

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

    const handleSubmit = () => {
        setLoginError('')
        setIsLoggedIn(true)
        /* TODO: hit API endpoint */
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
                            : handleSubmit
                    }
                    label="Password"
                    password={{
                        isPasswordVisible,
                        setIsPasswordVisible,
                        setConfirmPassword: isSigningUp
                            ? setConfirmPassword
                            : undefined,
                        setErrorConfirmPassword: isSigningUp
                            ? setErrorConfirmPassword
                            : undefined,
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
                            handleSubmitEditing={handleSubmit}
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
                handleSubmit={handleSubmit}
                isDisabled={
                    (isSigningUp && errorConfirmPassword.length > 0) ||
                    errorPassword.length > 0 ||
                    errorUserName.length > 0 ||
                    (isSigningUp && confirmPassword.length === 0) ||
                    password.length === 0 ||
                    userName.length === 0
                }
                isSigningUp={isSigningUp}
            />
        </>
    )
}

export default Form
