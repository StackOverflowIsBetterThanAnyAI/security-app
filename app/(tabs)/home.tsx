import { useContext, useRef, useState } from 'react'
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import Button from '@/components/button'
import HighlightImage from '@/components/highlight-image'
import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import MoveToTop from '@/components/move-to-top'
import Pagination from '@/components/pagination'
import ThemedText from '@/components/themed-text'
import { ContextUser } from '@/context/ContextUser'

const error = require('@/assets/images/error.webp')

const HomeScreen = () => {
    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error('HomeScreen must be used within a ContextUser.Provider')
    }
    const { userName } = contextUser

    const scrollRef = useRef<ScrollView>(null)
    const [imageHighlighted, setImageHighlighted] = useState<any>('')
    const [isMoveToTopVisible, setIsMoveToTopVisible] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)

    const handleRefresh = () => {
        /* TODO */
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
                <Button
                    accessibilityLabel="Refresh Recordings"
                    handlePress={handleRefresh}
                    label="Refresh"
                />
                <ImageGrid
                    images={[
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                        error,
                    ]}
                    setImageHighlighted={setImageHighlighted}
                />
                <Button
                    accessibilityLabel="Refresh Recordings"
                    handlePress={handleRefresh}
                    label="Refresh"
                />
                <Pagination page={page} setPage={setPage} />
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
    titleContainer: {
        flexDirection: 'column',
        gap: 8,
    },
})

export default HomeScreen
