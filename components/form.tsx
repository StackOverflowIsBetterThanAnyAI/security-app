import { useContext, useMemo, useRef, useState } from 'react'
import { Platform, TextInput, View } from 'react-native'

import { handleApiLogin } from '@/api/handleApiLogin'
import FormError from '@/components/form-error'
import FormInput from '@/components/form-input'
import FormSubmit from '@/components/form-submit'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import { URL, URL_MOBILE } from '@/constants/api'
import { ContextIsLoggedIn } from '@/context/ContextLogin'
import { ContextLoginError } from '@/context/ContextLoginError'
import { ContextUserName } from '@/context/ContextUserName'
import { useThemeColor } from '@/hooks/use-theme-color'

const Form = () => {
    const contextIsLoggedIn = useContext(ContextIsLoggedIn)
    if (!contextIsLoggedIn) {
        throw new Error('Form must be used within a ContextIsLoggedIn.Provider')
    }
    const [_isLoggedIn, setIsLoggedIn] = contextIsLoggedIn

    const contextLoginError = useContext(ContextLoginError)
    if (!contextLoginError) {
        throw new Error('Form must be used within a ContextLoginError.Provider')
    }
    const [_loginError, setLoginError] = contextLoginError

    const contextUserName = useContext(ContextUserName)
    if (!contextUserName) {
        throw new Error('Form must be used within a ContextUserName.Provider')
    }
    const [userName, setUserName] = contextUserName

    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [errorUserName, setErrorUserName] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')

    const [data, setData] = useState<{ token: string; role: string } | null>(
        null
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const userNameRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    const color = useThemeColor({}, 'red')

    const userNamePattern = useMemo(() => /^[a-z0-9]{5,20}$/i, [])
    const passwordPattern = useMemo(() => /^[^\s]{8,25}$/, [])

    const handleLogin = (isLogin: boolean) =>
        handleApiLogin({
            isLogin,
            password,
            setData,
            setIsLoading,
            setIsLoggedIn,
            setLoginError,
            url: Platform.OS === 'web' ? URL : URL_MOBILE,
            userName,
        })

    const handleSwitch = () => {
        setIsSigningUp((prev) => !prev)
    }

    return (
        <>
            <ThemedText center type="title" accessibilityRole="header">
                {isSigningUp ? 'Signup' : 'Login'}
            </ThemedText>
            <View>
                <ThemedText center>
                    {isSigningUp
                        ? 'Create a new account.'
                        : 'Log in with an existing account.'}
                </ThemedText>
                <ThemedText center>
                    All fields marked with{' '}
                    <ThemedText style={{ color }}>*</ThemedText> are required.
                </ThemedText>
            </View>
            <FormSwitch handleClick={handleSwitch} isSigningUp={isSigningUp} />
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
                            : () => handleLogin(true)
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
                            handleSubmitEditing={() => handleLogin(false)}
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
                handleSubmit={
                    isSigningUp
                        ? () => handleLogin(false)
                        : () => handleLogin(true)
                }
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
