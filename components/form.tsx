import { useRouter } from 'expo-router'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, TextInput, View } from 'react-native'

import { handleApiLogin } from '@/api/handleApiLogin'
import FormError from '@/components/form-error'
import FormInput from '@/components/form-input'
import FormSubmit from '@/components/form-submit'
import FormSwitch from '@/components/form-switch'
import ThemedText from '@/components/themed-text'
import { URL, URL_MOBILE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextUser, UserRoleType } from '@/context/ContextUser'
import { loadData } from '@/helper/storeData'
import { useThemeColor } from '@/hooks/use-theme-color'

const Form = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error('Form must be used within a ContextError.Provider')
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('Form must be used within a ContextUser.Provider')
    }
    const {
        setIsUserLoggedIn,
        userName,
        setUserName,
        setUserRole,
        setUserToken,
    } = contextUser

    const router = useRouter()

    const [isSigningUp, setIsSigningUp] = useState<boolean>(true)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [errorUserName, setErrorUserName] = useState<string>('')
    const [errorPassword, setErrorPassword] = useState<string>('')
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')

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
            router,
            setConfirmPassword,
            setError,
            setIsLoading,
            setIsUserLoggedIn,
            setPassword,
            setRetryFn,
            setUserRole,
            setUserToken,
            url: Platform.OS === 'web' ? URL : URL_MOBILE,
            userName,
        })

    const handleSwitch = () => {
        setIsSigningUp((prev) => !prev)
    }

    useEffect(() => {
        const autoLogin = async () => {
            const data = await loadData(['authName', 'authRole', 'authToken'])
            if (data?.authToken && data?.authName && data?.authRole) {
                setIsUserLoggedIn(true)
                setUserName(data.authName)
                setUserRole(data.authRole as UserRoleType)
                setUserToken(data.authToken)
                router.replace('/home')
            }
        }
        autoLogin()
    }, [])

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
            <FormSwitch
                handleClick={handleSwitch}
                isLoading={isLoading}
                isSigningUp={isSigningUp}
            />
            <View>
                <FormInput
                    error={errorUserName}
                    handleSubmitEditing={() => passwordRef?.current?.focus()}
                    isLoading={isLoading}
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
                    isLoading={isLoading}
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
                            isLoading={isLoading}
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
                isLoading={isLoading}
                isSigningUp={isSigningUp}
            />
        </>
    )
}

export default Form
