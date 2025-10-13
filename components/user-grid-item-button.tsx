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
    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'backgroundSecondary')
    const borderColorActive = useThemeColor({}, 'border')
    const borderColorInactive = useThemeColor({}, 'textInactive')
    const borderColorRedActive = useThemeColor({}, 'red')
    const borderColorRedInactive = useThemeColor({}, 'redInactive')

    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderRadius: 12,
            borderWidth: 2,
            minWidth: 144,
            paddingVertical: 4,
            paddingHorizontal: 16,
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

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{
                disabled: isLoading || role === 'admin',
            }}
            accessibilityLabel={`${
                isDelete
                    ? 'Delete User'
                    : role === 'user'
                    ? 'Promote'
                    : 'Demote'
            }${isLoading || role === 'admin' ? ', disabled' : ''}`}
            onPress={isLoading || role !== 'admin' ? handlePress : undefined}
            style={({ pressed }) => [
                {
                    opacity:
                        pressed && !isLoading && role !== 'admin' ? 0.75 : 1,
                },
                styles.button,
                isDelete
                    ? isLoading || role === 'admin'
                        ? styles.disabledDelete
                        : styles.enabledDelete
                    : isLoading || role === 'admin'
                    ? styles.disabledRole
                    : styles.enabledRole,
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
                    {isDelete
                        ? 'Delete User'
                        : role === 'user'
                        ? 'Promote'
                        : 'Demote'}
                </ThemedText>
            )}
        </Pressable>
    )
}

export default UserGridItemButton
