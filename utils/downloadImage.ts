import * as FileSystem from 'expo-file-system/legacy'
import { shareAsync } from 'expo-sharing'

type downloadImageProps = {
    imageName: string
    imageSource: any
}

export const downloadImage = async ({
    imageName,
    imageSource,
}: downloadImageProps) => {
    const result = await FileSystem.downloadAsync(
        imageSource.uri,
        FileSystem.documentDirectory + imageName
    )
    try {
        await shareAsync(result.uri)
    } catch (error: any) {
        console.error('Sharing failed:', error)
    }
}
