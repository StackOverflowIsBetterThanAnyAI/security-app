import { FlatList } from 'react-native'

import ImageGridItem from '@/components/image-grid-item'
import { ITEMS_PER_PAGE } from '@/constants/api'

type ImageGridProps = {
    images: string[]
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
    userToken: string
}

const ImageGrid = ({
    images,
    setImageHighlighted,
    userToken,
}: ImageGridProps) => {
    return (
        <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
                <ImageGridItem
                    bottomRowIndices={[ITEMS_PER_PAGE - 1, ITEMS_PER_PAGE - 2]}
                    index={index}
                    item={item}
                    setImageHighlighted={setImageHighlighted}
                    userToken={userToken}
                />
            )}
        />
    )
}

export default ImageGrid
