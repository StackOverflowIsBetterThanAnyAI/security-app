import * as FileSystem from 'expo-file-system/legacy'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { shareAsync } from 'expo-sharing'
import { Alert } from 'react-native'

type downloadImageProps = {
    imageName: string
    imageSource: any
    imageRotation: number
}

const IMAGE_NAME_PATTERN =
    /^security_image_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.jpg$/

const getServedImageName = (headers: Record<string, string>) => {
    const key = Object.keys(headers).find(
        (header) => header.toLowerCase() === 'x-image-name'
    )
    const name = key ? headers[key] : undefined
    return name && IMAGE_NAME_PATTERN.test(name) ? name : undefined
}

export const downloadImage = async ({
    imageName,
    imageSource,
    imageRotation,
}: downloadImageProps) => {
    const tempDownloadUri =
        FileSystem.cacheDirectory + 'raw_download_' + imageName

    try {
        const download = await FileSystem.downloadAsync(
            imageSource.uri,
            tempDownloadUri,
            { headers: imageSource.headers }
        )

        if (download.status !== 200) {
            await FileSystem.deleteAsync(tempDownloadUri, { idempotent: true })
            Alert.alert(
                'Image not available',
                download.status === 404
                    ? 'This image no longer exists. It has probably been replaced by a newer one.'
                    : `The image could not be downloaded (HTTP ${download.status}).`
            )
            return
        }

        const finalImageName = getServedImageName(download.headers) ?? imageName
        const finalTargetUri = FileSystem.cacheDirectory + finalImageName

        await FileSystem.deleteAsync(finalTargetUri, { idempotent: true })

        if (imageRotation) {
            const rotatedImage = await ImageManipulator.manipulate(
                tempDownloadUri
            )
                .rotate(imageRotation)
                .renderAsync()
            const manipulatedImage = await rotatedImage.saveAsync({
                compress: 1,
                format: SaveFormat.JPEG,
            })
            rotatedImage.release()

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
            dialogTitle: finalImageName,
        })
    } catch (error: any) {
        console.error('Download/Processing failed:', error)
        await FileSystem.deleteAsync(tempDownloadUri, { idempotent: true })
        Alert.alert('Download failed', 'The image could not be shared.')
    }
}
