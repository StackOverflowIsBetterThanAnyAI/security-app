import { Image } from 'expo-image'
import { useContext, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import Button from '@/components/button'
import ThemedText from '@/components/themed-text'
import { ContextImageRotation } from '@/context/ContextImageRotation'
import { ContextUser } from '@/context/ContextUser'
import { useHighlightImageSize } from '@/hooks/use-highlight-image-size'
import { useThemeColor } from '@/hooks/use-theme-color'
import { saveImage, shareImage } from '@/utils/downloadImage'

const errorImageSource = require('./../assets/images/error.webp')

type ImageGridProps = {
    imageHighlighted: string | null
    setImageHighlighted: React.Dispatch<React.SetStateAction<string | null>>
}

const HighlightImage = ({
    imageHighlighted,
    setImageHighlighted,
}: ImageGridProps) => {
    const contextImageRotation = useContext(ContextImageRotation)
    if (!contextImageRotation) {
        throw new Error(
            'HighlightImage must be used within a ContextImageRotation.Provider'
        )
    }
    const { imageRotation } = contextImageRotation

    const contextUser = useContext(ContextUser)
    if (!contextUser) {
        throw new Error(
            'HighlightImage must be used within a ContextUser.Provider'
        )
    }
    const { userToken } = contextUser

    const imageHeaders = useMemo(
        () => ({ Authorization: `Bearer ${userToken}` }),
        [userToken]
    )

    const { width, height } = Dimensions.get('window')

    const activityColor = useThemeColor({}, 'text')
    const backgroundColor = useThemeColor({}, 'background')
    const highlightColor = useThemeColor({}, 'highlight')

    const [imageHeight, setImageHeight] = useState<number>(256)
    const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false)
    const [imageIsLoadedSuccess, setImageIsLoadedSuccess] =
        useState<boolean>(false)

    const imageSource = imageIsLoadedSuccess
        ? { uri: imageHighlighted!, headers: imageHeaders }
        : errorImageSource

    const formattedDate = () => {
        if (
            !/security_image_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.jpg/.test(
                imageSource.uri
            )
        ) {
            return ''
        }

        const date = decodeURI(imageSource.uri)
            .replace(/(.jpg.*)$/, '')
            .split(/security_image_/)[1]
            .split(/_/)

        const day = date[0]
        const time = date[1].replace(/-/g, ':')

        return `Recording of ${day} ${time}`
    }

    const handleCloseImage = () => {
        setImageHighlighted(null)
    }

    const handleErrorImage = () => {
        setImageIsLoadedSuccess(false)
    }

    const imageProps = () => ({
        imageName: decodeURI(imageSource.uri)
            .replace(/.*(?=security_image_)/, '')
            .replace(/\.jpg.*$/, '.jpg'),
        imageRotation,
        imageSource,
    })

    const handlePress = () => shareImage(imageProps())

    const handleSave = () => saveImage(imageProps())

    useHighlightImageSize({
        height,
        imageHighlighted,
        imageHeaders,
        setImageHeight,
        setImageIsLoaded,
        setImageIsLoadedSuccess,
        width,
    })

    const styles = StyleSheet.create({
        activity: { backgroundColor, height: imageHeight },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        footer: {
            backgroundColor,
            paddingHorizontal: 16,
            paddingVertical: 12,
            width: '100%',
        },
        image: {
            backgroundColor,
            height: imageHeight,
            transform: [{ rotate: `${imageRotation}deg` }],
            width,
        },
        wrapper: {
            backgroundColor: highlightColor,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: '100%',
            zIndex: 10,
        },
    })

    return (
        <Pressable
            accessible={true}
            accessibilityRole="button"
            onPress={handleCloseImage}
            style={[styles.wrapper]}
        >
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
                {imageIsLoaded && imageIsLoadedSuccess && imageSource.uri && (
                    <>
                        <Image
                            alt={formattedDate() || 'Past Recording'}
                            source={imageSource}
                            style={styles.image}
                            contentFit="contain"
                            onError={handleErrorImage}
                        />
                        <View style={styles.footer}>
                            {formattedDate().length ? (
                                <ThemedText center>
                                    {formattedDate()}
                                </ThemedText>
                            ) : undefined}
                            <View style={styles.buttons}>
                                <Button
                                    accessibilityLabel="Save Image to Gallery"
                                    handlePress={handleSave}
                                    label="Save"
                                />
                                <Button
                                    accessibilityLabel="Share Image"
                                    handlePress={handlePress}
                                    label="Share"
                                />
                            </View>
                        </View>
                    </>
                )}
                {imageIsLoaded && !imageIsLoadedSuccess && (
                    <Image
                        alt="Error Image"
                        source={imageSource}
                        style={styles.image}
                        contentFit="contain"
                        onError={handleErrorImage}
                    />
                )}
                {!imageIsLoaded && (
                    <ActivityIndicator
                        color={activityColor}
                        size="large"
                        style={styles.activity}
                    />
                )}
            </Pressable>
        </Pressable>
    )
}

export default HighlightImage
