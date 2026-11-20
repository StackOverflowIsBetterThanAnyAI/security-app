const NETWORK_ERROR_PATTERN =
    /network request failed|fetch failed|connectexception|failed to connect|unable to resolve host|unreachable|timed out/i

export const getErrorMessage = (error: unknown) => {
    if (!(error instanceof Error)) {
        return 'Unknown error'
    }
    if (error.name === 'AbortError' || error.message.includes('Aborted')) {
        return 'Response from Server took too long'
    }
    if (NETWORK_ERROR_PATTERN.test(error.message)) {
        return 'Server is not reachable.\nCheck that the Raspberry Pi is running and that you are connected to the same network.'
    }
    return error.message
}
