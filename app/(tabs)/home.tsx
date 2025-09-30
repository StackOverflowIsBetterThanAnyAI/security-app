import { useContext, useRef, useState } from 'react'
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import MoveToTop from '@/components/move-to-top'
import Pagination from '@/components/pagination'
import RefreshButton from '@/components/refresh-button'
import ThemedText from '@/components/themed-text'
import { ContextUserName } from '@/context/ContextUserName'

const error = require('@/assets/images/error.webp')

const HomeScreen = () => {
    const contextUserName = useContext(ContextUserName)
    if (!contextUserName) {
        throw new Error(
            'TabLayout must be used within a ContextUserName.Provider'
        )
    }
    const [userName, _setUserName] = contextUserName

    const scrollRef = useRef<ScrollView>(null)
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
                <RefreshButton handlePress={handleRefresh} />
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
                />
                <RefreshButton handlePress={handleRefresh} />
                <Pagination page={page} setPage={setPage} />
            </MainView>
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
