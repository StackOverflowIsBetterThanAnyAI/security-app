import { File, Paths } from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import { Alert } from 'react-native'

import { getErrorMessage } from '@/helper/getErrorMessage'
import { getApiUrl } from '@/utils/apiUrl'

type downloadDayProps = {
    day: string
    onProgress: (bytesWritten: number) => void
    userToken: string
}

export const downloadDay = async ({
    day,
    onProgress,
    userToken,
}: downloadDayProps) => {
    const target = new File(Paths.cache, `security_images_${day}.zip`)

    try {
        const file = await File.downloadFileAsync(
            `${getApiUrl()}/days/${day}/zip`,
            target,
            {
                headers: { Authorization: `Bearer ${userToken}` },
                idempotent: true,
                onProgress: ({ bytesWritten }) => onProgress(bytesWritten),
            }
        )
        await shareAsync(file.uri, {
            mimeType: 'application/zip',
            dialogTitle: file.name,
        })
    } catch (error: unknown) {
        console.error('Downloading day failed:', error)
        if (target.exists) {
            target.delete()
        }
        Alert.alert('Download failed', getErrorMessage(error))
    }
}
