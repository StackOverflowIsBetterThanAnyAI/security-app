import { Image } from 'expo-image'
import { useFocusEffect } from 'expo-router'
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import IconSymbol from '@/components/icon-symbol'
import ThemedText from '@/components/themed-text'
import { API_TIMEOUT_MS, URL } from '@/constants/api'
import { Colors } from '@/constants/theme'
import { ContextImageRotation } from '@/context/ContextImageRotation'
import { useThemeColor } from '@/hooks/use-theme-color'
import { formatDay } from '@/utils/formatDay'

const errorImageSource = require('./../assets/images/error.webp')

const FRAMES_PER_SECOND = 12
const FRAMES_BEFORE_START = 36
const PREFETCH_CONCURRENCY = 4

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

type TimelapsePlayerProps = {
    day: string
    thumbnail?: string
    userToken: string
}

const frameTime = (uri: string) => {
    const match = /_(\d{2})-(\d{2})-\d{2}\.jpg$/.exec(uri)
    return match ? `${match[1]}:${match[2]}` : ''
}

const fetchDayImages = async (day: string, headers: Record<string, string>) => {
    const paths: string[] = []
    let page = 1
    let total = Infinity

    while (paths.length < total) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
        try {
            const response = await fetch(
                `${URL}/images?day=${day}&page=${page}`,
                { headers, signal: controller.signal }
            )
            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }
            const data: { images: string[]; total_images: number } =
                await response.json()
            total = data.total_images
            if (!data.images.length) {
                break
            }
            paths.push(...data.images)
            page++
        } finally {
            clearTimeout(timeoutId)
        }
    }

    return paths.map((path) => `${URL}${encodeURI(path)}`)
}

const TimelapsePlayer = ({
    day,
    thumbnail,
    userToken,
}: TimelapsePlayerProps) => {
    const contextImageRotation = useContext(ContextImageRotation)
    if (!contextImageRotation) {
        throw new Error(
            'TimelapsePlayer must be used within a ContextImageRotation.Provider'
        )
    }
    const { imageRotation } = contextImageRotation

    const barColor = useThemeColor(
        { light: Colors.dark.highlight },
        'highlight'
    )
    const barTextColor = useThemeColor({}, 'textLight')
    const borderColor = useThemeColor({}, 'border')
    const highlightColor = useThemeColor({}, 'highlight')

    const headers = useMemo(
        () => ({ Authorization: `Bearer ${userToken}` }),
        [userToken]
    )

    const [frames, setFrames] = useState<string[]>([])
    const [index, setIndex] = useState<number>(0)
    const [loaded, setLoaded] = useState<number>(0)
    const [status, setStatus] = useState<Status>('idle')
    const [thumbnailFailed, setThumbnailFailed] = useState<boolean>(false)

    const isMounted = useRef<boolean>(true)
    const loadedRef = useRef<number>(0)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    const loadFrames = async () => {
        setStatus('loading')
        setFrames([])
        setIndex(0)
        setLoaded(0)
        loadedRef.current = 0

        try {
            const uris = await fetchDayImages(day, headers)
            if (!isMounted.current) {
                return
            }
            if (!uris.length) {
                throw new Error('No images')
            }
            setFrames(uris)

            const done = new Array<boolean>(uris.length).fill(false)
            let next = 0
            let contiguous = 0

            const worker = async () => {
                while (isMounted.current && next < uris.length) {
                    const current = next++
                    await Image.prefetch(uris[current], {
                        cachePolicy: 'memory-disk',
                        headers,
                    }).catch(() => false)
                    done[current] = true
                    while (contiguous < uris.length && done[contiguous]) {
                        contiguous++
                    }
                    if (isMounted.current) {
                        loadedRef.current = contiguous
                        setLoaded(contiguous)
                        if (
                            contiguous >=
                            Math.min(FRAMES_BEFORE_START, uris.length)
                        ) {
                            setStatus((status) =>
                                status === 'loading' ? 'playing' : status
                            )
                        }
                    }
                }
            }

            await Promise.all(
                Array.from({ length: PREFETCH_CONCURRENCY }, worker)
            )
        } catch {
            if (isMounted.current) {
                setStatus('error')
            }
        }
    }

    useEffect(() => {
        if (status !== 'playing' || !frames.length) {
            return
        }
        const interval = setInterval(() => {
            setIndex((current) => {
                const next = (current + 1) % frames.length
                return next !== 0 && next >= loadedRef.current ? current : next
            })
        }, 1000 / FRAMES_PER_SECOND)
        return () => clearInterval(interval)
    }, [frames.length, status])

    useFocusEffect(
        useCallback(() => {
            return () => {
                setStatus((current) =>
                    current === 'playing' ? 'paused' : current
                )
            }
        }, [])
    )

    const handlePress = () => {
        if (status === 'idle' || status === 'error') {
            loadFrames()
        } else if (status === 'playing') {
            setStatus('paused')
        } else if (status === 'paused') {
            setStatus('playing')
        }
    }

    const showFrames = frames.length > 0 && status !== 'error'
    const imageSource = showFrames
        ? { uri: frames[index], headers }
        : thumbnail && !thumbnailFailed
          ? { uri: `${URL}${encodeURI(thumbnail)}`, headers }
          : errorImageSource

    const isBuffering =
        status === 'playing' && loaded < frames.length && index + 1 >= loaded

    const label =
        status === 'loading'
            ? `Loading ${loaded} / ${frames.length || '…'}`
            : status === 'error'
              ? 'Timelapse unavailable, tap to retry'
              : status === 'idle'
                ? 'Timelapse'
                : frameTime(frames[index])

    const accessibilityLabel =
        status === 'playing'
            ? 'Pause Timelapse'
            : status === 'paused'
              ? `Resume Timelapse, paused at ${frameTime(frames[index])}`
              : status === 'loading'
                ? 'Loading Timelapse'
                : `Play Timelapse of ${formatDay(day)}`

    const styles = StyleSheet.create({
        bar: {
            alignItems: 'center',
            backgroundColor: barColor,
            bottom: 0,
            flexDirection: 'row',
            gap: 8,
            left: 0,
            paddingHorizontal: 12,
            paddingVertical: 6,
            position: 'absolute',
            right: 0,
        },
        image: {
            aspectRatio: 16 / 9,
            backgroundColor: highlightColor,
            transform: [{ rotate: `${imageRotation}deg` }],
            width: '100%',
        },
        label: {
            color: barTextColor,
            flex: 1,
        },
        wrapper: {
            borderColor,
            borderRadius: 12,
            borderWidth: 2,
            overflow: 'hidden',
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ busy: status === 'loading' }}
            onPress={handlePress}
            style={({ pressed }) => [
                styles.wrapper,
                { opacity: pressed ? 0.75 : 1 },
            ]}
        >
            <Image
                alt={`Timelapse of ${formatDay(day)}`}
                cachePolicy="memory-disk"
                contentFit="cover"
                onError={() => {
                    if (!showFrames) {
                        setThumbnailFailed(true)
                    }
                }}
                source={imageSource}
                style={styles.image}
            />
            <View style={styles.bar}>
                {status === 'loading' || isBuffering ? (
                    <ActivityIndicator color={barTextColor} />
                ) : (
                    <IconSymbol
                        color={barTextColor}
                        name={status === 'playing' ? 'pause' : 'play-arrow'}
                        size={28}
                    />
                )}
                <ThemedText style={styles.label}>{label}</ThemedText>
            </View>
        </Pressable>
    )
}

export default TimelapsePlayer
