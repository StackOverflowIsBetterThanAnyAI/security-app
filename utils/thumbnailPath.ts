// the backend serves a small preview of every archive image
export const thumbnailPath = (imagePath: string) =>
    imagePath.replace(/^\/image\//, '/thumbnail/')
