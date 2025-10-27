import { StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { UserRoleType } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import IconSymbol, { memberProfile, userProfile } from './icon-symbol'
import ThemedText from './themed-text'

export type UserHeaderProps = {
    userName: string
    userRole: UserRoleType
}

const UserHeader = ({ userName, userRole }: UserHeaderProps) => {
    const avatarColor = useThemeColor(
        { light: Colors.light.buttonInactive },
        'textLight'
    )
    const backgroundColorAvatar = useThemeColor(
        { light: Colors.light.textLight },
        'buttonInactive'
    )
    const borderColorButton = useThemeColor({}, 'border')

    const styles = StyleSheet.create({
        avatarContainer: {
            alignSelf: 'center',
            backgroundColor: backgroundColorAvatar,
            borderColor: avatarColor,
            borderRadius: 100,
            borderWidth: 6,
            padding: 8,
        },
        borderBottom: {
            borderBottomWidth: 2,
            borderBottomColor: borderColorButton,
            marginHorizontal: 8,
            paddingBottom: 16,
        },
        titleContainer: {
            flexDirection: 'column',
            gap: 24,
        },
    })

    return (
        <View style={styles.titleContainer}>
            <ThemedText center type="title">
                Welcome, {userName}!
            </ThemedText>
            <View style={styles.avatarContainer}>
                {userRole === 'user' ? (
                    userProfile(avatarColor)
                ) : userRole === 'member' ? (
                    memberProfile(avatarColor)
                ) : (
                    <IconSymbol name="person" size={128} color={avatarColor} />
                )}
            </View>
            <ThemedText
                center
                type="subtitle"
                style={userRole === 'admin' ? styles.borderBottom : undefined}
            >
                Role:{' '}
                {userRole.substring(0, 1).toUpperCase() + userRole.substring(1)}
            </ThemedText>
        </View>
    )
}
export default UserHeader
