import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import ThemedText from '@/components/themed-text'
import {
    checkForErrorConfirmPassword,
    checkForErrorPassword,
    checkForErrorUserName,
} from '@/helper/checkForError'
import { useThemeColor } from '@/hooks/use-theme-color'
import { hidePassword, showPassword } from '@/icons/icons'

type FormInputProps = {
    error: string
    handleSubmitEditing: () => void
    isLoading: boolean
    label: string
    password: {
        enteredPassword?: string
        isPasswordVisible?: boolean
        setIsPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>
        setConfirmPassword?: React.Dispatch<React.SetStateAction<string>>
        setErrorConfirmPassword?: React.Dispatch<React.SetStateAction<string>>
    }
    pattern: RegExp
    placeholder: string
    ref: React.RefObject<TextInput | null>
    returnKeyType: 'done' | 'next'
    setError: React.Dispatch<React.SetStateAction<string>>
    setValue: React.Dispatch<React.SetStateAction<string>>
    submitBehavior: 'submit' | 'blurAndSubmit'
    type: 'username' | 'password' | 'confirmpassword'
    value: string
}

const FormInput = ({
    error,
    handleSubmitEditing,
    isLoading,
    label,
    password,
    pattern,
    placeholder,
    ref,
    returnKeyType,
    setError,
    setValue,
    submitBehavior,
    type,
    value,
}: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false)

    const backgroundColor = useThemeColor({}, 'background')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const colorRed = useThemeColor({}, 'red')
    const colorInput = useThemeColor({}, 'text')
    const colorPlaceholder = useThemeColor({}, 'textInactive')

    const handleBlur = () => {
        setIsFocused(false)
    }

    const handleChangeText = (textValue: string) => {
        setValue(textValue)
        if (
            type === 'password' &&
            password.setConfirmPassword &&
            password.setErrorConfirmPassword
        ) {
            password.setConfirmPassword('')
            password.setErrorConfirmPassword('')
        }
        switch (type) {
            case 'username':
                checkForErrorUserName(pattern, setError, textValue)
                break
            case 'password':
                checkForErrorPassword(pattern, setError, textValue)
                break
            case 'confirmpassword':
                checkForErrorConfirmPassword(
                    password.enteredPassword,
                    setError,
                    textValue
                )
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handlePress = () => {
        ref?.current?.focus()
    }

    const handleToggleVisibility = () => {
        if (password.setIsPasswordVisible) {
            password.setIsPasswordVisible((prev) => !prev)
        }
    }

    const styles = StyleSheet.create({
        input: {
            backgroundColor,
            borderColor: error
                ? colorRed
                : isFocused
                ? borderColorActive
                : borderColorInactive,
            borderRadius: 8,
            borderWidth: 2,
            color: colorInput,
            marginVertical: 8,
            padding: 8,
        },
        label: {
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            justifyContent: 'space-between',
        },
        wrapper: {
            paddingBottom: error ? 0 : 32,
        },
    })

    return (
        <View style={styles.wrapper}>
            <View style={styles.label}>
                <Pressable
                    onPress={!isLoading ? handlePress : undefined}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isLoading }}
                >
                    <ThemedText>
                        {label}{' '}
                        <ThemedText style={{ color: colorRed }}>*</ThemedText>
                    </ThemedText>
                </Pressable>
                {['password', 'confirmpassword'].includes(type) && (
                    <Pressable
                        onPress={
                            !isLoading ? handleToggleVisibility : undefined
                        }
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: isLoading }}
                        style={({ pressed }) => [
                            { opacity: pressed && !isLoading ? 0.75 : 1 },
                        ]}
                    >
                        {password.isPasswordVisible
                            ? hidePassword(colorInput)
                            : showPassword(colorInput)}
                    </Pressable>
                )}
            </View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel={label}
                accessibilityState={{ disabled: isLoading }}
                editable={!isLoading}
                secureTextEntry={
                    ['password', 'confirmpassword'].includes(type) &&
                    !password.isPasswordVisible
                }
                placeholderTextColor={colorPlaceholder}
                ref={ref}
                returnKeyType={returnKeyType}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onSubmitEditing={handleSubmitEditing}
                submitBehavior={submitBehavior}
                value={value}
                onChangeText={handleChangeText}
            />
        </View>
    )
}

export default FormInput
