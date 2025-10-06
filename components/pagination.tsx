import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import ThemedText from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type PaginationProps = {
    ITEMS_PER_PAGE: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    totalImages: number
}

const Pagination = ({
    ITEMS_PER_PAGE,
    page,
    setPage,
    totalImages,
}: PaginationProps) => {
    const backgroundColorActive = useThemeColor({}, 'red')
    const backgroundColorInactive = useThemeColor({}, 'background')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const colorActive = useThemeColor({}, 'tint')
    const colorInative = useThemeColor({}, 'textInactive')

    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false)
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(true)

    const handlePressNext = () => {
        const next = page + 1
        if (next >= Math.ceil(totalImages / ITEMS_PER_PAGE)) {
            setIsNextDisabled(true)
        } else {
            setIsNextDisabled(false)
        }
        setPage(next)
        setIsPreviousDisabled(false)
    }
    const handlePressPrevious = () => {
        if (page > 1) {
            const prev = page - 1
            if (prev <= 1) {
                setIsPreviousDisabled(true)
            }
            setPage(prev)
            setIsNextDisabled(false)
        }
    }

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
            borderColor: borderColorInactive,
        },
        enabled: {
            backgroundColor: backgroundColorActive,
            borderColor: borderColorActive,
        },
        wrapper: {
            alignItems: 'center',
            backgroundColor: backgroundColorInactive,
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'row',
            gap: 32,
            height: 48,
            justifyContent: 'center',
            marginHorizontal: 'auto',
        },
    })

    return (
        <View style={styles.wrapper}>
            <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ disabled: isPreviousDisabled }}
                accessibilityLabel={`Go to previous Page${
                    isPreviousDisabled ? ', disabled' : ''
                }`}
                style={({ pressed }) => [
                    styles.button,
                    isPreviousDisabled ? styles.disabled : styles.enabled,
                    !isPreviousDisabled &&
                        pressed && {
                            opacity: 0.75,
                        },
                ]}
                onPress={handlePressPrevious}
            >
                <IconSymbol
                    size={28}
                    name={'chevron-left'}
                    color={isPreviousDisabled ? colorInative : colorActive}
                />
            </Pressable>
            <ThemedText>{page}</ThemedText>
            <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ disabled: isNextDisabled }}
                accessibilityLabel={`Go to next Page${
                    isNextDisabled ? ', disabled' : ''
                }`}
                style={({ pressed }) => [
                    styles.button,
                    isNextDisabled ? styles.disabled : styles.enabled,
                    !isNextDisabled &&
                        pressed && {
                            opacity: 0.75,
                        },
                ]}
                onPress={handlePressNext}
            >
                <IconSymbol
                    size={28}
                    name={'chevron-right'}
                    color={isNextDisabled ? colorInative : colorActive}
                />
            </Pressable>
        </View>
    )
}

export default Pagination
