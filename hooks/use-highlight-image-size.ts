import { useEffect } from 'react'
import { Image } from 'react-native'

type useHighlightImageSizeProps = {
    height: number
    imageHighlighted: string | null
    setImageHeight: (value: React.SetStateAction<number>) => void
    setImageIsLoaded: (value: React.SetStateAction<boolean>) => void
    setImageIsLoadedSuccess: (value: React.SetStateAction<boolean>) => void
    width: number
}

export const useHighlightImageSize = ({
    height,
    imageHighlighted,
    setImageHeight,
    setImageIsLoaded,
    setImageIsLoadedSuccess,
    width,
}: useHighlightImageSizeProps) => {
    useEffect(() => {
        setImageIsLoaded(false)
        setImageIsLoadedSuccess(false)

        if (imageHighlighted) {
            Image.getSize(
                imageHighlighted,
                (originalWidth, originalHeight) => {
                    const calculatedHeight =
                        (width / originalWidth) * originalHeight
                    setImageHeight(Math.min(calculatedHeight, height))
                    setImageIsLoaded(true)
                    setImageIsLoadedSuccess(true)
                },
                () => {
                    setImageHeight(256)
                    setImageIsLoaded(true)
                    setImageIsLoadedSuccess(false)
                }
            )
        }
    }, [
        height,
        imageHighlighted,
        setImageHeight,
        setImageIsLoaded,
        setImageIsLoadedSuccess,
        width,
    ])
}
