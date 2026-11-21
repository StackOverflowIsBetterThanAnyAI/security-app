import * as FileSystem from 'expo-file-system/legacy'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { Asset, requestPermissionsAsync } from 'expo-media-library'
import { shareAsync } from 'expo-sharing'
import { Alert } from 'react-native'

type downloadImageProps = {
    imageName: string
    imageSource: any
    imageRotation: number
}

type PreparedImage = {
    name: string
    uri: string
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

// downloads the image into the cache and applies the rotation,
// returns null after showing an alert if that fails
const prepareImage = async ({
    imageName,
    imageSource,
    imageRotation,
}: downloadImageProps): Promise<PreparedImage | null> => {
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
            return null
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

        return { name: finalImageName, uri: finalTargetUri }
    } catch (error: any) {
        console.error('Download/Processing failed:', error)
        await FileSystem.deleteAsync(tempDownloadUri, { idempotent: true })
        Alert.alert('Download failed', 'The image could not be downloaded.')
        return null
    }
}

export const shareImage = async (props: downloadImageProps) => {
    const image = await prepareImage(props)
    if (!image) {
        return
    }

    try {
        await shareAsync(image.uri, {
            mimeType: 'image/jpeg',
            dialogTitle: image.name,
        })
    } catch (error: any) {
        console.error('Sharing failed:', error)
        Alert.alert('Sharing failed', 'The image could not be shared.')
    }
}

export const saveImage = async (props: downloadImageProps) => {
    let permission
    try {
        permission = await requestPermissionsAsync(true, ['photo'])
    } catch (error: any) {
        console.error('Requesting media library permission failed:', error)
        Alert.alert(
            'Saving not available',
            'This app version cannot access the gallery. Use a development or release build.'
        )
        return
    }
    if (!permission.granted) {
        Alert.alert(
            'Permission required',
            'Allow access to your photos in the system settings to save images.'
        )
        return
    }

    const image = await prepareImage(props)
    if (!image) {
        return
    }

    try {
        await Asset.create(image.uri)
        Alert.alert('Image saved', `${image.name} is now in your gallery.`)
    } catch (error: any) {
        console.error('Saving failed:', error)
        Alert.alert('Saving failed', 'The image could not be saved.')
    } finally {
        await FileSystem.deleteAsync(image.uri, { idempotent: true })
    }
}
