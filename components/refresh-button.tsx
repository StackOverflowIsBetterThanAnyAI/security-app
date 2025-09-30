import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Pressable, StyleSheet } from 'react-native'

type RefreshButtonProps = {
    handlePress: () => void
}

const RefreshButton = ({ handlePress }: RefreshButtonProps) => {
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
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Refresh Recordings"
            style={({ pressed }) => [
                styles.button,
                pressed && {
                    opacity: 0.75,
                },
            ]}
            onPress={handlePress}
        >
            <ThemedText>Refresh</ThemedText>
        </Pressable>
    )
}

export default RefreshButton
