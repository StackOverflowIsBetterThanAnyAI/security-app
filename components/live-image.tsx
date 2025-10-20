import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchLive } from '@/api/handleApiFetchLive'
import Button from '@/components/button'
import ThemedText from '@/components/themed-text'
import { URL } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

const errorImageSource = require('./../assets/images/error.webp')

const LiveImage = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'GalleryScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('LiveImage must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userToken } = contextUser

    const [refreshTime, setRefreshTime] = useState<number | null>(Date.now())
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageLoadFailed, setImageLoadFailed] = useState(false)
    const [imageName, setImageName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const backgroundColorSecondary = useThemeColor({}, 'buttonInactive')
    const router = useRouter()

    const fullUriWithToken = `${URL}/live?token=${userToken}&time=${refreshTime}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : { uri: fullUriWithToken }

    const formattedDate = () => {
        if (!imageName.length) {
            return 'Error Image'
        }
        const date = imageName
            .replace(/^(security_image_)/, '')
            .replace(/(.jpg$)/, '')
            .split(/_/)

        const day = date[0]
        const time = date[1].replace(/-/g, ':')

        return `Live Image ${day} ${time}`
    }

    const handlePress = () => {}

    const handleFetchLive = useCallback(() => {
        handleApiFetchLive({
            router,
            setError,
            setImageName,
            setIsLoading,
            setIsUserLoggedIn,
            setRetryFn,
            userToken,
        })
    }, [
        router,
        setError,
        setImageName,
        setIsLoading,
        setIsUserLoggedIn,
        setRetryFn,
        userToken,
    ])

    const handleRefreshImage = useCallback(() => {
        setImageLoadFailed(false)
        setImageIsLoaded(false)
        setRefreshTime(Date.now())
        handleFetchLive()
    }, [setImageLoadFailed, setImageIsLoaded, setRefreshTime, handleFetchLive])

    useFocusEffect(
        useCallback(() => {
            handleRefreshImage()
            const refresh = setInterval(() => {
                handleRefreshImage()
            }, 30000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleRefreshImage])
    )

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
                {imageIsLoaded &&
                    imageSource.uri &&
                    imageName &&
                    !isLoading && (
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
