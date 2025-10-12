import { FlatList } from 'react-native'

import { UsersType } from '@/api/handleApiFetchUsers'
import UserGridItem from '@/components/user-grid-item'
import { useThemeColor } from '@/hooks/use-theme-color'

type UserGridProps = {
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    users: UsersType[]
}

const UserGrid = ({ setUsers, users }: UserGridProps) => {
    const borderColor = useThemeColor({}, 'border')

    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={{
                paddingVertical: 8,
                borderBottomWidth: 2,
                borderBottomColor: borderColor,
                marginHorizontal: 8,
            }}
            renderItem={({ item }) => (
                <UserGridItem item={item} setUsers={setUsers} />
            )}
        />
    )
}

export default UserGrid
