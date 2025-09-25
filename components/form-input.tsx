import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useState } from 'react'
import {
    KeyboardTypeOptions,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'

type FormInputProps = {
    handleSubmitEditing?: () => void
    isPassword?: boolean
    label: string
    placeholder: string
    ref: React.RefObject<TextInput | null>
    returnKeyType: 'done' | 'next'
    submitBehavior: 'submit' | 'blurAndSubmit'
    type: KeyboardTypeOptions
}

const FormInput = ({
    handleSubmitEditing,
    isPassword = false,
    label,
    placeholder,
    ref,
    returnKeyType,
    submitBehavior,
    type,
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

    const styles = StyleSheet.create({
        button: { width: '100%' },
        input: {
            borderColor: isFocused ? borderColorActive : borderColorInactive,
            borderRadius: 8,
            borderWidth: 2,
            color: colorInput,
            marginVertical: 8,
            padding: 8,
        },
    })

    return (
        <View>
            <ThemedText>
                <Pressable onPress={handleFocus} style={styles.button}>
                    <ThemedText>
                        {label}{' '}
                        <ThemedText style={{ color: colorRed }}>*</ThemedText>
                    </ThemedText>
                </Pressable>
            </ThemedText>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={type}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel={label}
                secureTextEntry={isPassword}
                placeholderTextColor={colorPlaceholder}
                ref={ref}
                returnKeyType={returnKeyType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onSubmitEditing={handleSubmitEditing}
                submitBehavior={submitBehavior}
            />
        </View>
    )
}

export default FormInput
