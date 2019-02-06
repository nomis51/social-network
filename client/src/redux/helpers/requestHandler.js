export const requestHandler = (res, type, requestName) => {
    if (res.errors) {
        throw new Error('Invalid request response');
    } else if (res.data) {
        return {
            type,
            payload: res.data[requestName]
        }
    }
};