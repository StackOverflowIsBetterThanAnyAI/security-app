import { Pressable, StyleSheet } from 'react-native'

import IconSymbol, {
    chevronDoubleLeft,
    chevronDoubleRight,
} from '@/components/icon-symbol'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

type PaginationButtonProps = {
    handlePress: () => void
    isDisabled: boolean
    isLoading: boolean
    icon:
        | 'chevron-left'
        | 'chevron-right'
        | 'chevron-double-left'
        | 'chevron-double-right'
}

const PaginationButton = ({
    handlePress,
    isDisabled,
    isLoading,
    icon,
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
            accessibilityLabel={`Go to ${icon === 'chevron-double-left' ? 'first' : icon === 'chevron-double-right' ? 'last' : icon === 'chevron-left' ? 'previous' : 'next'} Page${
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
            {icon === 'chevron-double-left' ? (
                chevronDoubleLeft(
                    isDisabled || isLoading ? colorInactive : colorActive
                )
            ) : icon === 'chevron-double-right' ? (
                chevronDoubleRight(
                    isDisabled || isLoading ? colorInactive : colorActive
                )
            ) : (
                <IconSymbol
                    size={28}
                    name={icon}
                    color={
                        isDisabled || isLoading ? colorInactive : colorActive
                    }
                />
            )}
        </Pressable>
    )
}

export default PaginationButton
