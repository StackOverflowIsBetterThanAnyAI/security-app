import { useRouter } from 'expo-router'
import { useContext, useRef, useState } from 'react'
import {
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
import { URL, URL_MOBILE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import { noFile } from '@/icons/icons'

// TODO: const error = require('@/assets/images/error.webp')

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
    const { userName, userToken } = contextUser

    const router = useRouter()
    const colorIcon = useThemeColor({}, 'text')

    const scrollRef = useRef<ScrollView>(null)

    const [imageHighlighted, setImageHighlighted] = useState<any>('')
    const [isMoveToTopVisible, setIsMoveToTopVisible] = useState<boolean>(false)

    const [images, setImages] = useState<string[] | null>(null)
    // TODO
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    // TODO
    const [totalImages, setTotalImages] = useState<number>(1)

    const handleRefresh = () => {
        handleApiFetchImages({
            router,
            setError,
            setImages,
            setIsLoading,
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
                </View>
                {images ? (
                    <>
                        <Button
                            accessibilityLabel="Refresh Recordings"
                            handlePress={handleRefresh}
                            label="Refresh"
                        />
                        <ImageGrid
                            images={images}
                            setImageHighlighted={setImageHighlighted}
                        />
                        <Pagination page={page} setPage={setPage} />
                    </>
                ) : (
                    <View style={styles.noImagesContainer}>
                        {noFile(colorIcon)}
                        <ThemedText center>
                            Currently, there are no Recordings available.
                        </ThemedText>
                        <Button
                            accessibilityLabel="Refresh Recordings"
                            handlePress={handleRefresh}
                            label="Refresh"
                        />
                    </View>
                )}
            </MainView>
            <HighlightImage
                imageHighlighted={imageHighlighted}
                setImageHighlighted={setImageHighlighted}
                source={imageHighlighted}
            />
            <MoveToTop isVisible={isMoveToTopVisible} scrollRef={scrollRef} />
        </>
    )
}

const styles = StyleSheet.create({
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
