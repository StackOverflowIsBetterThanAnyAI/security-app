import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useRouter } from 'expo-router'
import { useContext, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchImages } from '@/api/handleApiFetchImages'
import Button from '@/components/button'
import HighlightImage from '@/components/highlight-image'
import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import MoveToTop from '@/components/move-to-top'
import Pagination from '@/components/pagination'
import ThemedText from '@/components/themed-text'
import { ITEMS_PER_PAGE, URL, URL_MOBILE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import { noFile } from '@/icons/icons'

const HomeScreen = () => {
    const contextError = useContext(ContextError)
    if (!contextError) {
        throw new Error(
            'HomeScreen must be used within a ContextError.Provider'
        )
    }
    const { setError, setRetryFn } = contextError

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('HomeScreen must be used within a ContextUser.Provider')
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
    const [page, setPage] = useState<number>(1)
    const [totalImages, setTotalImages] = useState<number>(1)

    const handleFetchImages = () => {
        handleApiFetchImages({
            page,
            router,
            setError,
            setImages,
            setIsLoading,
            setIsUserLoggedIn,
            setPage,
            setRetryFn,
            setTotalImages,
            url: Platform.OS === 'web' ? URL : URL_MOBILE,
            userToken,
        })
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y
        setIsMoveToTopVisible(offsetY > 128)
    }

    useEffect(() => {
        handleFetchImages()
        const refresh = setInterval(() => {
            handleFetchImages()
        }, 300000)
        return () => {
            clearInterval(refresh)
        }
    }, [handleFetchImages])

    return (
        <>
            <MainView
                ref={scrollRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.titleContainer}>
                    <ThemedText center type="title">
                        Welcome, {userName}!
                    </ThemedText>
                    <ThemedText type="title">Past Recordings</ThemedText>
                    <ThemedText type="subtitle">
                        TODO: Filter by Date
                    </ThemedText>
                </View>
                {isLoading && !images ? (
                    <View
                        style={[
                            styles.activityLoader,
                            { bottom: -tabBarHeight },
                        ]}
                    >
                        <ActivityIndicator size="large" color={colorIcon} />
                    </View>
                ) : images ? (
                    <>
                        <Button
                            accessibilityLabel="Refresh Recordings"
                            handlePress={handleFetchImages}
                            label="Refresh"
                        />
                        <ImageGrid
                            images={images}
                            setImageHighlighted={setImageHighlighted}
                            url={Platform.OS === 'web' ? URL : URL_MOBILE}
                            userToken={userToken}
                        />
                        {totalImages > ITEMS_PER_PAGE && (
                            <>
                                {images.length > 12 && (
                                    <Button
                                        accessibilityLabel="Refresh Recordings"
                                        handlePress={handleFetchImages}
                                        label="Refresh"
                                    />
                                )}
                                <Pagination
                                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                    page={page}
                                    router={router}
                                    setPage={setPage}
                                    setImages={setImages}
                                    setTotalImages={setTotalImages}
                                    totalImages={totalImages}
                                    url={
                                        Platform.OS === 'web' ? URL : URL_MOBILE
                                    }
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
                            accessibilityLabel="Refresh Recordings"
                            handlePress={handleFetchImages}
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

export default HomeScreen
