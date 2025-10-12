import { FlatList } from 'react-native'

import { UsersType } from '@/api/handleApiFetchUsers'
import UserGridItem from '@/components/user-grid-item'

type UserGridProps = {
    setUsers: React.Dispatch<React.SetStateAction<UsersType[]>>
    users: UsersType[]
}

const UserGrid = ({ setUsers, users }: UserGridProps) => {
    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={{ paddingTop: 8 }}
            renderItem={({ item }) => (
                <UserGridItem item={item} setUsers={setUsers} />
            )}
        />
    )
}

export default UserGrid
