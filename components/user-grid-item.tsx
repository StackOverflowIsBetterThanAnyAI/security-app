import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { handleApiChangeRole } from '@/api/handleApiChangeRole'
import { handleApiDeleteUser } from '@/api/handleApiDeleteUser'
import { UsersType } from '@/api/handleApiFetchUsers'
import ThemedText from '@/components/themed-text'
import UserGridItemButton from '@/components/user-grid-item-button'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

type UserGridItemProps = {
    item: UsersType
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
}

const UserGridItem = ({ item, setUsers }: UserGridItemProps) => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'UserGridItem must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'UserGridItem must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userToken } = contextUser

    const backgroundColor = useThemeColor({}, 'backgroundSecondary')
    const router = useRouter()

    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false)
    const [isLoadingRole, setIsLoadingRole] = useState<boolean>(false)

    const handleDelete = () => {
        handleApiDeleteUser({
            id: item.id,
            router,
            setError,
            setIsLoading: setIsLoadingDelete,
            setIsUserLoggedIn,
            setUsers,
            setRetryFn,
            userToken,
        })
    }

    const handleRole = () => {
        handleApiChangeRole({
            id: item.id,
            role: item.role === 'user' ? 'member' : 'user',
            router,
            setError,
            setIsLoading: setIsLoadingRole,
            setIsUserLoggedIn,
            setRetryFn,
            setUsers,
            userToken,
        })
    }

    const styles = StyleSheet.create({
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        textContainer: { alignItems: 'flex-end', flexDirection: 'row', gap: 2 },
        wrapper: {
            backgroundColor,
            borderRadius: 8,
            flexDirection: 'column',
            gap: 12,
            justifyContent: 'space-between',
            marginBottom: 12,
            minHeight: 96,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
    })

    return (
        <View style={styles.wrapper}>
            <View style={styles.textContainer}>
                <ThemedText type="subtitle" numberOfLines={1}>
                    {item.name}
                </ThemedText>
                <ThemedText>: {item.role}</ThemedText>
            </View>
            <View style={styles.buttonContainer}>
                <UserGridItemButton
                    handlePress={handleRole}
                    isLoading={isLoadingRole}
                    role={item.role}
                />
                <UserGridItemButton
                    handlePress={handleDelete}
                    isDelete
                    isLoading={isLoadingDelete}
                    role={item.role}
                />
            </View>
        </View>
    )
}

export default UserGridItem
