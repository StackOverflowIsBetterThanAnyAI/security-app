import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchImages } from '@/api/handleApiFetchImages'
import Button from '@/components/button'
import HighlightImage from '@/components/highlight-image'
import { noFile } from '@/components/icon-symbol'
import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import Pagination from '@/components/pagination'
import ThemedText from '@/components/themed-text'
import { ITEMS_PER_PAGE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextImageRotation } from '@/context/ContextImageRotation'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'

const GalleryScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'GalleryScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextImageRotation = useContext(ContextImageRotation)
    if (!contextImageRotation) {
        throw new Error(
            'GalleryScreen must be used within a ContextImageRotation.Provider'
        )
    }
    const { setImageRotation } = contextImageRotation

    const contextPage = useContext(ContextPage)
    if (!contextPage) {
        throw new Error(
            'GalleryScreen must be used within a ContextPage.Provider'
        )
    }
    const { page, setIsNextDisabled, setIsPreviousDisabled, setPage } =
        contextPage

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'GalleryScreen must be used within a ContextUser.Provider'
        )
    }
    const { setIsUserLoggedIn, userName, userToken } = contextUser

    const colorIcon = useThemeColor({}, 'text')
    const router = useRouter()
    const tabBarHeight = useBottomTabBarHeight()

    const [imageHighlighted, setImageHighlighted] = useState<string | null>(
        null
    )

    const [images, setImages] = useState<string[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingInitially, setIsLoadingInitially] = useState<boolean>(true)
    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)
    const [totalImages, setTotalImages] = useState<number>(1)

    const handleFetchImages = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            handleApiFetchImages({
                page,
                router,
                setError,
                setImages,
                setIsLoading,
                setIsNextDisabled,
                setIsPreviousDisabled,
                setIsUserLoggedIn,
                setPage,
                setRetryFn,
                setTotalImages,
                userToken,
            })
        },
        [
            page,
            router,
            setError,
            setImages,
            setIsNextDisabled,
            setIsPreviousDisabled,
            setIsUserLoggedIn,
            setPage,
            setRetryFn,
            setTotalImages,
            userToken,
        ]
    )

    const handleFetchImagesManual = useCallback(() => {
        handleFetchImages(setIsLoading)
        setIsLoadingInitially(false)
    }, [handleFetchImages, setIsLoading, setIsLoadingInitially])

    const handleFetchImagesPull = () => {
        handleFetchImages(setIsLoadingPull)
    }

    const handleRotateImage = () => {
        setImageRotation((prev) => (prev + 180) % 360)
    }

    useFocusEffect(
        useCallback(() => {
            handleFetchImagesManual()
            const refresh = setInterval(() => {
                handleFetchImagesManual()
            }, 300000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleFetchImagesManual])
    )

    return (
        <>
            <MainView
                refreshControl={
                    <RefreshControl
                        accessibilityLabel="Refreshing Past Recordings"
                        refreshing={isLoadingPull}
                        onRefresh={handleFetchImagesPull}
                        tintColor={colorIcon}
                    />
                }
            >
                <View style={styles.titleContainer}>
                    <ThemedText center type="title">
                        Welcome, {userName}!
                    </ThemedText>
                    <ThemedText type="title">Past Recordings</ThemedText>
                </View>
                {isLoading && isLoadingInitially && !images?.length ? (
                    <View
                        style={[
                            styles.activityLoader,
                            { bottom: -tabBarHeight },
                        ]}
                    >
                        <ActivityIndicator size="large" color={colorIcon} />
                    </View>
                ) : images?.length ? (
                    <>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                accessibilityLabel="Refresh Past Recordings"
                                handlePress={handleFetchImagesManual}
                                label="Refresh"
                            />
                            <Button
                                accessibilityLabel="Rotate Live Image"
                                handlePress={handleRotateImage}
                                label="Rotate"
                            />
                        </View>
                        <ImageGrid
                            images={images}
                            setImageHighlighted={setImageHighlighted}
                            userToken={userToken}
                        />
                        {totalImages > ITEMS_PER_PAGE && (
                            <>
                                {images.length > 12 && (
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Button
                                            accessibilityLabel="Refresh Past Recordings"
                                            handlePress={
                                                handleFetchImagesManual
                                            }
                                            label="Refresh"
                                        />
                                        <Button
                                            accessibilityLabel="Rotate Live Image"
                                            handlePress={handleRotateImage}
                                            label="Rotate"
                                        />
                                    </View>
                                )}
                                <Pagination
                                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                    router={router}
                                    setImages={setImages}
                                    setTotalImages={setTotalImages}
                                    totalImages={totalImages}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <View style={styles.noImagesContainer}>
                        {noFile(colorIcon)}
                        <ThemedText center>
                            Currently, there are no Recordings available.
                        </ThemedText>
                        <Button
                            accessibilityLabel="Refresh Past Recordings"
                            handlePress={handleFetchImagesManual}
                            label="Refresh"
                        />
                    </View>
                )}
            </MainView>
            {imageHighlighted && (
                <HighlightImage
                    imageHighlighted={imageHighlighted}
                    setImageHighlighted={setImageHighlighted}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    activityLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
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

export default GalleryScreen
