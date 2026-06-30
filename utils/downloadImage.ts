import * as FileSystem from 'expo-file-system/legacy'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { shareAsync } from 'expo-sharing'

type downloadImageProps = {
    imageName: string
    imageSource: any
    imageRotation: number
}

export const downloadImage = async ({
    imageName,
    imageSource,
    imageRotation,
}: downloadImageProps) => {
    try {
        const result = await FileSystem.downloadAsync(
            imageSource.uri,
            FileSystem.documentDirectory + imageName
        )

        let finalUri = result.uri

        if (imageRotation) {
            const manipulatedImage = await manipulateAsync(
                result.uri,
                [{ rotate: imageRotation }],
                { compress: 1, format: SaveFormat.JPEG }
            )
            finalUri = manipulatedImage.uri
        }

        await shareAsync(finalUri)
    } catch (error: any) {
        console.error('Download/Processing failed:', error)
    }
}
