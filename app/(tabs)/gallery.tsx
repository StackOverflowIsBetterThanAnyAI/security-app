import { useFocusEffect, useRouter } from 'expo-router'
import { useBottomTabBarHeight } from 'expo-router/tabs'
import { useCallback, useContext, useState } from 'react'
import {
    ActivityIndicator,
    BackHandler,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native'

import { handleApiFetchDays, RecordingDay } from '@/api/handleApiFetchDays'
import { handleApiFetchImages } from '@/api/handleApiFetchImages'
import Button from '@/components/button'
import DayGrid from '@/components/day-grid'
import HighlightImage from '@/components/highlight-image'
import { noFile } from '@/components/icon-symbol'
import ImageGrid from '@/components/image-grid'
import MainView from '@/components/main-view'
import Pagination from '@/components/pagination'
import ThemedText from '@/components/themed-text'
import TimelapsePlayer from '@/components/timelapse-player'
import { ITEMS_PER_PAGE } from '@/constants/api'
import { ContextError } from '@/context/ContextError'
import { ContextImageRotation } from '@/context/ContextImageRotation'
import { ContextPage } from '@/context/ContextPage'
import { ContextUser } from '@/context/ContextUser'
import { useThemeColor } from '@/hooks/use-theme-color'
import { downloadDay } from '@/utils/downloadDay'
import { formatDay } from '@/utils/formatDay'

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

    const [days, setDays] = useState<RecordingDay[] | null>(null)
    const [downloadedBytes, setDownloadedBytes] = useState<number>(0)
    const [images, setImages] = useState<string[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoadingPull, setIsLoadingPull] = useState<boolean>(false)
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [totalImages, setTotalImages] = useState<number>(1)

    const handleFetch = useCallback(
        (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
            if (selectedDay) {
                handleApiFetchImages({
                    day: selectedDay,
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
            } else {
                handleApiFetchDays({
                    router,
                    setDays,
                    setError,
                    setIsLoading,
                    setIsUserLoggedIn,
                    setRetryFn,
                    userToken,
                })
            }
        },
        [
            page,
            router,
            selectedDay,
            setError,
            setIsNextDisabled,
            setIsPreviousDisabled,
            setIsUserLoggedIn,
            setPage,
            setRetryFn,
            userToken,
        ]
    )

    const handleFetchManual = useCallback(() => {
        handleFetch(setIsLoading)
    }, [handleFetch])

    const handleFetchPull = () => {
        handleFetch(setIsLoadingPull)
    }

    const handleDownloadDay = async () => {
        if (!selectedDay) {
            return
        }
        setDownloadedBytes(0)
        await downloadDay({
            day: selectedDay,
            onProgress: setDownloadedBytes,
            userToken,
        })
    }

    const handleRotateImage = () => {
        setImageRotation((prev) => (prev + 180) % 360)
    }

    const handleSelectDay = (date: string) => {
        setImages(null)
        setPage(1)
        setIsPreviousDisabled(true)
        setSelectedDay(date)
    }

    const handleShowDays = useCallback(() => {
        setImageHighlighted(null)
        setImages(null)
        setSelectedDay(null)
    }, [])

    useFocusEffect(
        useCallback(() => {
            handleFetchManual()
            const refresh = setInterval(() => {
                handleFetchManual()
            }, 300000)
            return () => {
                clearInterval(refresh)
            }
        }, [handleFetchManual])
    )

    useFocusEffect(
        useCallback(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (imageHighlighted) {
                        setImageHighlighted(null)
                        return true
                    }
                    if (selectedDay) {
                        handleShowDays()
                        return true
                    }
                    return false
                }
            )
            return () => subscription.remove()
        }, [handleShowDays, imageHighlighted, selectedDay])
    )

    const actions = (
        <View style={styles.actions}>
            <Button
                accessibilityLabel="Refresh Past Recordings"
                handlePress={handleFetchManual}
                label="Refresh"
            />
            <Button
                accessibilityLabel="Rotate Images"
                handlePress={handleRotateImage}
                label="Rotate"
            />
        </View>
    )

    const isEmpty = selectedDay ? !images?.length : !days?.length
    const isLoadingFirst = isLoading && (selectedDay ? !images : !days)

    return (
        <>
            <MainView
                refreshControl={
                    <RefreshControl
                        accessibilityLabel="Refreshing Past Recordings"
                        refreshing={isLoadingPull}
                        onRefresh={handleFetchPull}
                        tintColor={colorIcon}
                    />
                }
            >
                <View style={styles.titleContainer}>
                    <ThemedText center type="title">
                        Welcome, {userName}!
                    </ThemedText>
                    <ThemedText type="title">
                        {selectedDay
                            ? formatDay(selectedDay)
                            : 'Past Recordings'}
                    </ThemedText>
                    {selectedDay && (
                        <Button
                            accessibilityLabel="Show all Days"
                            handlePress={handleShowDays}
                            label="All Days"
                        />
                    )}
                </View>
                {isLoadingFirst ? (
                    <View
                        style={[
                            styles.activityLoader,
                            { bottom: -tabBarHeight },
                        ]}
                    >
                        <ActivityIndicator size="large" color={colorIcon} />
                    </View>
                ) : isEmpty ? (
                    <View style={styles.noImagesContainer}>
                        {noFile(colorIcon)}
                        <ThemedText center>
                            Currently, there are no Recordings available.
                        </ThemedText>
                        <Button
                            accessibilityLabel="Refresh Past Recordings"
                            handlePress={handleFetchManual}
                            label="Refresh"
                        />
                    </View>
                ) : selectedDay && images ? (
                    <>
                        <TimelapsePlayer
                            key={selectedDay}
                            day={selectedDay}
                            thumbnail={
                                days?.find((day) => day.date === selectedDay)
                                    ?.thumbnail
                            }
                            userToken={userToken}
                        />
                        <Button
                            accessibilityLabel={`Download all Recordings of ${formatDay(selectedDay)} as ZIP`}
                            handlePress={handleDownloadDay}
                            label="Download Day"
                            loadingLabel={`${(downloadedBytes / 1024 ** 2).toFixed(1)} MB`}
                        />
                        {actions}
                        <ImageGrid
                            images={images}
                            setImageHighlighted={setImageHighlighted}
                            userToken={userToken}
                        />
                        {totalImages > ITEMS_PER_PAGE && (
                            <>
                                {images.length > 12 && actions}
                                <Pagination
                                    day={selectedDay}
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
                    days && (
                        <>
                            {actions}
                            <DayGrid
                                days={days}
                                handleSelectDay={handleSelectDay}
                                userToken={userToken}
                            />
                        </>
                    )
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
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
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
