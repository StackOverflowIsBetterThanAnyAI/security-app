import { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Animated,
    Pressable,
    StyleSheet,
} from 'react-native'

import ThemedText from '@/components/themed-text'
import { UserRoleType } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

type UserGridItemButtonProps = {
    isDelete?: boolean
    isLoading: boolean
    handlePress: () => void
    role: UserRoleType
}

const UserGridItemButton = ({
    isDelete = false,
    isLoading,
    handlePress,
    role,
}: UserGridItemButtonProps) => {
    const handleButtonText = useCallback(() => {
        if (isDelete) {
            return 'Delete User'
        }
        if (role === 'user') {
            return 'Promote'
        }
        return 'Demote'
    }, [isDelete, role])

    const [isConfirming, setIsConfirming] = useState<boolean>(false)
    const buttonText = isConfirming ? 'Confirm' : handleButtonText()

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'backgroundSecondary')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const borderColorRedInactive = useThemeColor({}, 'redInactive')
    const colorRed = useThemeColor({}, 'red')

    const [fadeAnim] = useState(() => new Animated.Value(0))

    const accessibilityLabel = `${
        isDelete ? 'Delete User' : role === 'user' ? 'Promote' : 'Demote'
    }${isLoading || role === 'admin' ? ', disabled' : ''}`

    const onPress = () => {
        if (isLoading || role === 'admin') {
            return
        }

        if (isConfirming) {
            fadeAnim.stopAnimation()
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }).start(() => {
                setIsConfirming(false)
                handlePress()
            })
            return
        }

        setIsConfirming(true)

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start()
    }

    useEffect(() => {
        let timeoutId: number

        if (isConfirming) {
            timeoutId = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 750,
                    useNativeDriver: false,
                }).start(() => {
                    setIsConfirming(false)
                })
            }, 3000)
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [fadeAnim, isConfirming])

    const animatedBackgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColor, colorRed],
    })

    const styles = StyleSheet.create({
        animated: {
            borderRadius: 12,
        },
        button: {
            borderRadius: 12,
            borderWidth: 2,
            minWidth: 144,
            paddingVertical: 4,
            paddingHorizontal: 16,
        },
        confirming: {
            borderColor: colorRed,
        },
        disabledDelete: {
            borderColor: borderColorRedInactive,
        },
        disabledRole: {
            borderColor: borderColorInactive,
        },
        enabledDelete: {
            borderColor: colorRed,
        },
        enabledRole: {
            borderColor: borderColorActive,
        },
    })

    const buttonStyle = (() => {
        if (isConfirming) {
            return styles.confirming
        }
        if (isDelete) {
            if (isLoading || role === 'admin') {
                return styles.disabledDelete
            }
            return styles.enabledDelete
        }
        if (isLoading || role === 'admin') {
            return styles.disabledRole
        }
        return styles.enabledRole
    })()

    return (
        <Animated.View
            style={[
                { backgroundColor: animatedBackgroundColor },
                styles.animated,
                buttonStyle,
            ]}
        >
            <Pressable
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{
                    disabled: isLoading || role === 'admin',
                }}
                accessibilityLabel={accessibilityLabel}
                onPress={onPress}
                style={({ pressed }) => [
                    {
                        opacity:
                            pressed && !isLoading && role !== 'admin'
                                ? 0.75
                                : 1,
                    },
                    styles.button,
                    buttonStyle,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={activityColor}
                        style={{ height: 26 }}
                    />
                ) : (
                    <ThemedText
                        center
                        isDisabled={role === 'admin'}
                        style={{ height: 26 }}
                    >
                        {buttonText}
                    </ThemedText>
                )}
            </Pressable>
        </Animated.View>
    )
}

export default UserGridItemButton
