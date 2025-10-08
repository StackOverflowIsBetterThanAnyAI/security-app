import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'

type ButtonProps = {
    accessibilityLabel: string
    handlePress: () => void
    isLoading: boolean
    label: string
}

const Button = ({
    accessibilityLabel,
    handlePress,
    isLoading,
    label,
}: ButtonProps) => {
    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const borderColor = useThemeColor({}, 'border')

    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderColor,
            borderRadius: 12,
            borderWidth: 2,
            marginHorizontal: 'auto',
            marginTop: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
            minWidth: 128,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
            accessibilityLabel={`${accessibilityLabel}${
                isLoading ? ', disabled' : ''
            }`}
            style={({ pressed }) => [
                styles.button,
                !isLoading &&
                    pressed && {
                        opacity: 0.75,
                    },
            ]}
            onPress={!isLoading ? handlePress : undefined}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={activityColor}
                    style={{ height: 26 }}
                />
            ) : (
                <ThemedText center style={{ height: 26 }}>
                    {label}
                </ThemedText>
            )}
        </Pressable>
    )
}

export default Button
