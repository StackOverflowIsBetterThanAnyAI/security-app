import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchLive } from '@/api/handleApiFetchLive'
import Button from '@/components/button'
import { noFile } from '@/components/icon-symbol'
import MainView from '@/components/main-view'
import ThemedText from '@/components/themed-text'
import { URL } from '@/constants/api'
import { Colors } from '@/constants/theme'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import { downloadImage } from '@/utils/downloadImage'

const errorImageSource = require('./../../assets/images/error.webp')

const LiveScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'LiveScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('LiveScreen must be used within a ContextUser.Provider')
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const [refreshTime, setRefreshTime] = useState<number | null>(Date.now())
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageLoadFailed, setImageLoadFailed] = useState(false)
    const [imageName, setImageName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingInitially, setIsLoadingInitially] = useState<boolean>(true)
    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const backgroundColorSecondary = useThemeColor(
        { light: Colors.light.buttonActive },
        'buttonInactive'
    )
    const router = useRouter()

    const fullUriWithToken = `${URL}/live?token=${userToken}&time=${refreshTime}`

    const imageSource = imageLoadFailed
        ? errorImageSource
        : { uri: fullUriWithToken }

    const formattedDate = () => {
        if (
            !/security_image_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.jpg/.test(
                imageName
            )
        ) {
            return 'Current Live Image'
        }
        const date = imageName
            .replace(/^(security_image_)/, '')
            .replace(/(.jpg$)/, '')
            .split(/_/)

        const day = date[0]
        const time = date[1].replace(/-/g, ':')

        return `Live Image ${day} ${time}`
    }

    const handlePress = () => {
        downloadImage({ imageName, imageSource })
    }

    const handleFetchLive = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            handleApiFetchLive({
                router,
                setError,
                setImageName,
                setIsLoading,
                setIsUserLoggedIn,
                setRetryFn,
                userToken,
            })
        },
        [
            router,
            setError,
            setImageName,
            setIsUserLoggedIn,
            setRetryFn,
            userToken,
        ]
    )

    const handleRefreshImage = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            setImageLoadFailed(false)
            setImageIsLoaded(false)
            setRefreshTime(Date.now())
            handleFetchLive(setIsLoading)
        },
        [handleFetchLive, setImageLoadFailed, setImageIsLoaded, setRefreshTime]
    )

    const handleRefreshImageManual = useCallback(() => {
        handleRefreshImage(setIsLoading)
        setIsLoadingInitially(false)
    }, [handleRefreshImage, setIsLoading, setIsLoadingInitially])

    const handleRefreshImagePull = () => {
        handleRefreshImage(setIsLoadingPull)
    }

    useFocusEffect(
        useCallback(() => {
            handleRefreshImageManual()
            const refresh = setInterval(() => {
                handleRefreshImageManual()
            }, 30000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleRefreshImageManual])
    )

    const styles = StyleSheet.create({
        activityLoader: {
            alignItems: 'center',
            aspectRatio: 16 / 9,
            justifyContent: 'center',
            width: '100%',
        },
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
        noImagesContainer: {
            gap: 16,
            alignItems: 'center',
            marginTop: 64,
        },
        titleContainer: {
            flexDirection: 'column',
            gap: 16,
        },
    })

    return (
        <MainView
            refreshControl={
                <RefreshControl
                    accessibilityLabel="Refreshing Live Image"
                    refreshing={isLoadingPull}
                    onRefresh={handleRefreshImagePull}
                    tintColor={activityColor}
                />
            }
        >
            <View style={styles.titleContainer}>
                <ThemedText center type="title">
                    Welcome, {userName}!
                </ThemedText>
                <ThemedText type="title">Live Image</ThemedText>
            </View>
            {isLoading && isLoadingInitially && !imageName ? (
                <>
                    <Button
                        accessibilityLabel="Refresh Live Image"
                        handlePress={handleRefreshImageManual}
                        label="Refresh"
                    />
                    <View style={[styles.activityLoader]}>
                        <ActivityIndicator size="large" color={activityColor} />
                    </View>
                </>
            ) : imageName ? (
                <>
                    <Button
                        accessibilityLabel="Refresh Live Image"
                        handlePress={handleRefreshImageManual}
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
                                    <ThemedText center>
                                        {formattedDate()}
                                    </ThemedText>
                                </View>
                            )}
                        {!imageIsLoaded && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator
                                    color={activityColor}
                                    size="large"
                                />
                            </View>
                        )}
                    </Pressable>
                </>
            ) : (
                <View style={styles.noImagesContainer}>
                    {noFile(activityColor)}
                    <ThemedText center>
                        Currently, there is no Live Image available.
                    </ThemedText>
                    <Button
                        accessibilityLabel="Refresh Live Image"
                        handlePress={handleRefreshImageManual}
                        label="Refresh"
                    />
                </View>
            )}
        </MainView>
    )
}

export default LiveScreen
