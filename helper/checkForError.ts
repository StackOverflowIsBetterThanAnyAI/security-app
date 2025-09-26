export const checkForErrorConfirmPassword = (
    password: string | undefined,
    setError: React.Dispatch<React.SetStateAction<string>>,
    value: string
) => {
    if (password && value && password !== value) {
        setError('The entered Passwords do not match.')
    } else {
        setError('')
    }
}

export const checkForErrorPassword = (
    pattern: RegExp,
    setError: React.Dispatch<React.SetStateAction<string>>,
    value: string
) => {
    if (!pattern.test(value) && value) {
        const length = pattern.toString().split(/[{}]+/)[1]?.split(',') || []
        const minLength = Number(length[0])
        const maxLength = Number(length.at(-1))

        if (value.length < minLength) {
            setError(`The Password must have at least ${minLength} characters.`)
        } else if (value.length > maxLength) {
            setError(`The Password must not exceed ${maxLength} characters.`)
        } else {
            setError('The Password must not contain whitespace.')
        }
    } else {
        setError('')
    }
}

export const checkForErrorUserName = (
    pattern: RegExp,
    setError: React.Dispatch<React.SetStateAction<string>>,
    value: string
) => {
    if (!pattern.test(value) && value) {
        const length = pattern.toString().split(/[{}]+/)[1]?.split(',') || []
        const minLength = Number(length[0])
        const maxLength = Number(length.at(-1))

        if (value.length < minLength) {
            setError(
                `The User Name must have at least ${minLength} characters.`
            )
        } else if (value.length > maxLength) {
            setError(`The User Name must not exceed ${maxLength} characters.`)
        } else {
            setError('The User Name must only contain letters and numbers.')
        }
    } else {
        setError('')
    }
}
