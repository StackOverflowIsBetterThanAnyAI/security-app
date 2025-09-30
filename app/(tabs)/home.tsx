import { useContext, useRef, useState } from 'react'
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native'

import MainView from '@/components/main-view'
import MoveToTop from '@/components/move-to-top'
import RefreshButton from '@/components/refresh-button'
import ThemedText from '@/components/themed-text'
import { ContextUserName } from '@/context/ContextUserName'

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

    const handleRefresh = () => {
        /* TODO */
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y
        setIsMoveToTopVisible(offsetY > 256)
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
                {/* Recordings */}
                <RefreshButton handlePress={handleRefresh} />
                {/* Pagination */}
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
