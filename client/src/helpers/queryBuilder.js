export const queryBuilder = (queryString) => {
    return JSON.stringify({
        query: queryString
    });
}