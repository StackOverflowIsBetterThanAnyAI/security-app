import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'

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

    const [buttonText, setButtonText] = useState<string>(handleButtonText())
    const [isConfirming, setIsConfirming] = useState<boolean>(false)

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'backgroundSecondary')
    const backgroundColorConfirming = useThemeColor({}, 'red')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorConfirming = useThemeColor({}, 'red')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const borderColorRedActive = useThemeColor({}, 'red')
    const borderColorRedInactive = useThemeColor({}, 'redInactive')

    const accessibilityLabel = `${
        isDelete ? 'Delete User' : role === 'user' ? 'Promote' : 'Demote'
    }${isLoading || role === 'admin' ? ', disabled' : ''}`

    const onPress = () => {
        if (isLoading || role === 'admin') {
            return
        }
        setButtonText('Confirm')
        setIsConfirming(true)

        if (isConfirming) {
            setIsConfirming(false)
            handlePress()
        }
    }

    useEffect(() => {
        const newText = handleButtonText()
        setButtonText(newText)
    }, [handleButtonText])

    useEffect(() => {
        let timeoutId: number
        const prevText = handleButtonText()

        if (isConfirming) {
            timeoutId = setTimeout(() => {
                setIsConfirming(false)
                setButtonText(prevText)
            }, 3000)
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [handleButtonText, isConfirming, setIsConfirming])

    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderRadius: 12,
            borderWidth: 2,
            minWidth: 144,
            paddingVertical: 4,
            paddingHorizontal: 16,
        },
        confirming: {
            backgroundColor: backgroundColorConfirming,
            borderColor: borderColorConfirming,
        },
        disabledDelete: {
            borderColor: borderColorRedInactive,
        },
        disabledRole: {
            borderColor: borderColorInactive,
        },
        enabledDelete: {
            borderColor: borderColorRedActive,
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
                        pressed && !isLoading && role !== 'admin' ? 0.75 : 1,
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
    )
}

export default UserGridItemButton
