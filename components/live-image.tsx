import { useContext, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import Button from '@/components/button'
import ThemedText from '@/components/themed-text'
import { URL } from '@/constants/api'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import { formatNumber } from '@/utils/formatNumber'

const errorImageSource = require('./../assets/images/error.webp')

const LiveImage = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('LiveImage must be used within a ContextUser.Provider')
    }
    const { userToken } = contextUser

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const backgroundColorSecondary = useThemeColor({}, 'buttonInactive')

    const [refreshTime, setRefreshTime] = useState<number | null>(Date.now())
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageLoadFailed, setImageLoadFailed] = useState(false)

    const fullUriWithToken = `${URL}/live?token=${userToken}&time=${refreshTime}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : { uri: fullUriWithToken }

    const date = new Date(parseInt(imageSource?.uri?.split('&time=')[1]))
    const formattedDate = () => {
        const year = date.getFullYear()
        const month = formatNumber(date.getMonth() + 1)
        const day = formatNumber(date.getDate())
        const hour = formatNumber(date.getHours())
        const minutes = formatNumber(date.getMinutes())
        const seconds = formatNumber(date.getSeconds())

        return imageIsLoaded
            ? `Live Image ${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
            : 'Error Image'
    }

    const handlePress = () => {}

    const handleRefreshImage = () => {
        setImageLoadFailed(false)
        setImageIsLoaded(false)
        setRefreshTime(Date.now())
    }

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefreshImage()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const styles = StyleSheet.create({
        footer: {
            backgroundColor,
            paddingHorizontal: 16,
            paddingVertical: 12,
            width: '100%',
        },
        image: {
            height: '100%',
            opacity: imageIsLoaded ? 1 : 0,
            width: '100%',
        },
        imageWrapper: {
            aspectRatio: 16 / 9,
            backgroundColor,
        },
        loadingOverlay: {
            position: 'absolute',
            aspectRatio: 16 / 9,
            backgroundColor: backgroundColorSecondary,
            justifyContent: 'center',
            width: '100%',
        },
    })

    return (
        <>
            <Button
                accessibilityLabel="Refresh Recordings"
                handlePress={handleRefreshImage}
                label="Refresh"
            />
            <Pressable
                accessible={true}
                accessibilityRole="button"
                onPress={handlePress}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.75 : 1 },
                    styles.imageWrapper,
                ]}
            >
                <Image
                    alt={formattedDate()}
                    source={imageSource}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => {
                        setImageLoadFailed(true)
                        setImageIsLoaded(true)
                    }}
                    onLoad={() => setImageIsLoaded(true)}
                />
                {imageIsLoaded && imageIsLoaded && imageSource.uri && (
                    <View style={styles.footer}>
                        <ThemedText center>{formattedDate()}</ThemedText>
                    </View>
                )}
                {!imageIsLoaded && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator color={activityColor} size="large" />
                    </View>
                )}
            </Pressable>
        </>
    )
}
export default LiveImage
