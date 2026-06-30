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
    const tempDownloadUri =
        FileSystem.cacheDirectory + 'raw_download_' + imageName
    const finalTargetUri = FileSystem.cacheDirectory + imageName

    try {
        const checkTarget = await FileSystem.getInfoAsync(finalTargetUri)
        if (checkTarget.exists) {
            await FileSystem.deleteAsync(finalTargetUri, { idempotent: true })
        }

        await FileSystem.downloadAsync(imageSource.uri, tempDownloadUri)

        if (imageRotation) {
            const manipulatedImage = await manipulateAsync(
                tempDownloadUri,
                [{ rotate: imageRotation }],
                { compress: 1, format: SaveFormat.JPEG }
            )

            await FileSystem.copyAsync({
                from: manipulatedImage.uri,
                to: finalTargetUri,
            })

            await FileSystem.deleteAsync(manipulatedImage.uri, {
                idempotent: true,
            })
        } else {
            await FileSystem.copyAsync({
                from: tempDownloadUri,
                to: finalTargetUri,
            })
        }

        await FileSystem.deleteAsync(tempDownloadUri, { idempotent: true })

        await shareAsync(finalTargetUri, {
            mimeType: 'image/jpeg',
            dialogTitle: imageName,
        })
    } catch (error: any) {
        console.error('Download/Processing failed:', error)
    }
}
