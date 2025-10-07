import { useEffect } from 'react'
import { Image } from 'react-native'

type useHighlightImageSizeProps = {
    height: number
    imageHighlighted: string | null
    setImageHeight: (value: React.SetStateAction<number | null>) => void
    setImageIsLoadFailed: (value: React.SetStateAction<boolean>) => void
    width: number
}

export const useHighlightImageSize = ({
    height,
    imageHighlighted,
    setImageHeight,
    setImageIsLoadFailed,
    width,
}: useHighlightImageSizeProps) => {
    useEffect(() => {
        setImageHeight(null)
        setImageIsLoadFailed(false)

        if (imageHighlighted) {
            Image.getSize(
                imageHighlighted,
                (originalWidth, originalHeight) => {
                    const calculatedHeight =
                        (width / originalWidth) * originalHeight
                    setImageHeight(Math.min(calculatedHeight, height))
                    setImageIsLoadFailed(false)
                },
                () => {
                    setImageHeight(height * 0.5)
                    setImageIsLoadFailed(true)
                }
            )
        }
    }, [height, imageHighlighted, setImageHeight, setImageIsLoadFailed, width])
}
