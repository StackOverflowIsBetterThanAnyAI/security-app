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
    await shareAsync(result.uri)
}
