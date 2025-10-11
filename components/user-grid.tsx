import { FlatList } from 'react-native'

import { UsersType } from '@/api/handleApiFetchUsers'
import UserGridItem from '@/components/user-grid-item'

type UserGridProps = {
    users: UsersType[]
}

const UserGrid = ({ users }: UserGridProps) => {
    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={{ paddingTop: 8 }}
            renderItem={({ item, index }) => (
                <UserGridItem item={item} index={index} />
            )}
        />
    )
}

export default UserGrid
