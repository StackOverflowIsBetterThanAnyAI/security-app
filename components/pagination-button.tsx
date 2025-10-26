import { Pressable, StyleSheet } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

type PaginationButtonProps = {
    handlePress: () => void
    isDisabled: boolean
    isLoading: boolean
    isNext?: boolean
}

const PaginationButton = ({
    handlePress,
    isDisabled,
    isLoading,
    isNext = false,
}: PaginationButtonProps) => {
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'background')
    const borderColorActive = useThemeColor({}, 'border')
    const colorActive = useThemeColor(
        { light: Colors.light.background },
        'tint'
    )
    const colorInactive = useThemeColor({}, 'textInactive')

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            borderRadius: 24,
            borderWidth: 2,
            display: 'flex',
            height: 48,
            justifyContent: 'center',
            width: 48,
        },
        disabled: {
            backgroundColor: backgroundColorInactive,
            borderColor: colorInactive,
        },
        enabled: {
            backgroundColor: backgroundColorActive,
            borderColor: borderColorActive,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled || isLoading }}
            accessibilityLabel={`Go to ${isNext ? 'next' : 'previous'} Page${
                isDisabled || isLoading ? ', disabled' : ''
            }`}
            style={({ pressed }) => [
                styles.button,
                isDisabled || isLoading ? styles.disabled : styles.enabled,
                !isDisabled &&
                    !isLoading &&
                    pressed && {
                        opacity: 0.75,
                    },
            ]}
            onPress={!isDisabled && !isLoading ? handlePress : undefined}
        >
            <IconSymbol
                size={28}
                name={isNext ? 'chevron-right' : 'chevron-left'}
                color={isDisabled || isLoading ? colorInactive : colorActive}
            />
        </Pressable>
    )
}

export default PaginationButton
