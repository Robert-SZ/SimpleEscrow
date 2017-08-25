export const createCallMock = (result) => {
    return ()=> {
        return new Promise((resolve, reject) => {
            resolve(result);
        })
    }
};