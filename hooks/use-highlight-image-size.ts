import { Image } from 'expo-image'
import { useEffect } from 'react'

type useHighlightImageSizeProps = {
    height: number
    imageHighlighted: string | null
    imageHeaders: Record<string, string>
    setImageHeight: (value: React.SetStateAction<number>) => void
    setImageIsLoaded: (value: React.SetStateAction<boolean>) => void
    setImageIsLoadedSuccess: (value: React.SetStateAction<boolean>) => void
    width: number
}

export const useHighlightImageSize = ({
    height,
    imageHighlighted,
    imageHeaders,
    setImageHeight,
    setImageIsLoaded,
    setImageIsLoadedSuccess,
    width,
}: useHighlightImageSizeProps) => {
    useEffect(() => {
        setImageIsLoaded(false)
        setImageIsLoadedSuccess(false)

        let cancelled = false

        if (imageHighlighted) {
            Image.loadAsync({ uri: imageHighlighted, headers: imageHeaders })
                .then((image) => {
                    if (cancelled) return
                    const calculatedHeight =
                        (width / image.width) * image.height
                    setImageHeight(Math.min(calculatedHeight, height))
                    setImageIsLoaded(true)
                    setImageIsLoadedSuccess(true)
                })
                .catch(() => {
                    if (cancelled) return
                    setImageHeight(256)
                    setImageIsLoaded(true)
                    setImageIsLoadedSuccess(false)
                })
        }

        return () => {
            cancelled = true
        }
    }, [
        height,
        imageHighlighted,
        imageHeaders,
        setImageHeight,
        setImageIsLoaded,
        setImageIsLoadedSuccess,
        width,
    ])
}
