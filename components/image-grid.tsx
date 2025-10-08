import { FlatList } from 'react-native'

import { ITEMS_PER_PAGE } from '@/app/(tabs)/home'
import ImageGridItem from '@/components/image-grid-item'

type ImageGridProps = {
    images: string[]
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
    url: string
    userToken: string
}

const ImageGrid = ({
    images,
    setImageHighlighted,
    url,
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
                    url={url}
                    userToken={userToken}
                />
            )}
        />
    )
}

export default ImageGrid
