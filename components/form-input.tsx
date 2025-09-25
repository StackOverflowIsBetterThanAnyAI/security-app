import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

type FormInputProps = {
    error: string
    handleSubmitEditing?: () => void
    label: string
    password: {
        isPasswordVisible?: boolean
        isPassword?: boolean
        setIsPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>
    }
    placeholder: string
    ref: React.RefObject<TextInput | null>
    returnKeyType: 'done' | 'next'
    setValue: React.Dispatch<React.SetStateAction<string>>
    submitBehavior: 'submit' | 'blurAndSubmit'
    value: string
}

const FormInput = ({
    error,
    handleSubmitEditing,
    label,
    password,
    placeholder,
    ref,
    returnKeyType,
    setValue,
    submitBehavior,
    value,
}: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false)

    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const colorRed = useThemeColor({}, 'red')
    const colorInput = useThemeColor({}, 'text')
    const colorPlaceholder = useThemeColor({}, 'textInactive')

    const handleFocus = () => {
        ref?.current?.focus()
    }

    const handleToggleVisibility = () => {
        if (password.setIsPasswordVisible) {
            password.setIsPasswordVisible((prev) => !prev)
        }
    }

    const showPassword = (
        <MaterialCommunityIcons
            name="eye-outline"
            size={24}
            color={colorInput}
        />
    )

    const hidePassword = (
        <MaterialCommunityIcons
            name="eye-off-outline"
            size={24}
            color={colorInput}
        />
    )

    const styles = StyleSheet.create({
        input: {
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
            paddingBottom: error ? 0 : 30,
        },
    })

    return (
        <View style={styles.wrapper}>
            <View style={styles.label}>
                <Pressable onPress={handleFocus} accessible={true}>
                    <ThemedText>
                        {label}{' '}
                        <ThemedText style={{ color: colorRed }}>*</ThemedText>
                    </ThemedText>
                </Pressable>
                {password.isPassword && (
                    <Pressable
                        onPress={handleToggleVisibility}
                        accessible={true}
                    >
                        {password.isPasswordVisible
                            ? hidePassword
                            : showPassword}
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
                secureTextEntry={
                    password.isPassword && !password.isPasswordVisible
                }
                placeholderTextColor={colorPlaceholder}
                ref={ref}
                returnKeyType={returnKeyType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSubmitEditing={handleSubmitEditing}
                submitBehavior={submitBehavior}
                value={value}
                onChangeText={setValue}
            />
        </View>
    )
}

export default FormInput
