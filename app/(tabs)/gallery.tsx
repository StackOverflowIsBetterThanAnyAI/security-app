import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useContext, useRef, useState } from 'react'
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchImages } from '@/api/handleApiFetchImages'
import Button from '@/components/button'
import HighlightImage from '@/components/highlight-image'
import { noFile } from '@/components/icon-symbol'
import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import MoveToTop from '@/components/move-to-top'
import Pagination from '@/components/pagination'
import ThemedText from '@/components/themed-text'
import { ITEMS_PER_PAGE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
import { useThemeColor } from '@/hooks/use-theme-color'

const GalleryScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'GalleryScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

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

    const scrollRef = useRef<ScrollView>(null)

    const [imageHighlighted, setImageHighlighted] = useState<string | null>(
        null
    )
    const [isMoveToTopVisible, setIsMoveToTopVisible] = useState<boolean>(false)

    const [images, setImages] = useState<string[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
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
    }, [handleFetchImages, setIsLoading])

    const handleFetchImagesPull = () => {
        handleFetchImages(setIsLoadingPull)
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y
        setIsMoveToTopVisible(offsetY > 512)
    }

    useScrollToTop(scrollRef)

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
                ref={scrollRef}
                refreshControl={
                    <RefreshControl
                        accessibilityLabel="Refreshing Past Recordings"
                        refreshing={isLoadingPull}
                        onRefresh={handleFetchImagesPull}
                        tintColor={colorIcon}
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.titleContainer}>
                    <ThemedText center type="title">
                        Welcome, {userName}!
                    </ThemedText>
                    <ThemedText type="title">Past Recordings</ThemedText>
                </View>
                {isLoading && !images?.length ? (
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
                        <Button
                            accessibilityLabel="Refresh Past Recordings"
                            handlePress={handleFetchImagesManual}
                            label="Refresh"
                        />
                        <ImageGrid
                            images={images}
                            setImageHighlighted={setImageHighlighted}
                            userToken={userToken}
                        />
                        {totalImages > ITEMS_PER_PAGE && (
                            <>
                                {images.length > 12 && (
                                    <Button
                                        accessibilityLabel="Refresh Past Recordings"
                                        handlePress={handleFetchImagesManual}
                                        label="Refresh"
                                    />
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
            <MoveToTop isVisible={isMoveToTopVisible} scrollRef={scrollRef} />
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
