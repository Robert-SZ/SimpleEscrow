export const createCallMock = (result) => {
    return ()=> {
        return new Promise((resolve, reject) => {
            resolve(result);
        })
    }
};

export class ConnectorFactoryMock {
    getConnector(){
        return {
            getFromAccount: () => {
                return '0';
            },
            getCurrentProvider: () => {
                return {};
            },
            toAscii: (data) => {
                return data.toString();
            }
        }
    }
}