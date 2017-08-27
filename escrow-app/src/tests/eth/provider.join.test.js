import Provider from '../../eth/provider';
import {ConnectorFactoryMock} from '../helpers/mockHelper';


jest.mock('truffle-contract', () => {
    let module = require('../helpers/mockHelper');
    let contractInstance = {
        join: module.createCallMock({})
    };
    let contractInstanceTxLog = {
        txlog: {
            call: module.createCallMock({c: [10]})
        }
    };
    let contractInstanceTxLog0 = {
        txlog: {
            call: module.createCallMock({c: [0]})
        }
    };

    let atMock = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstance);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceTxLog);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstance);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceTxLog0);
        })
    });

    return jest.fn().mockImplementation(() => {
        return {
            setProvider: jest.fn(),
            at: atMock
        };
    });
});

describe('Etherium join provider tests', () => {
    test('join Ok', () => {
        let provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', new ConnectorFactoryMock().getConnector());
        provider.init();
        return provider.join(1, 50).then((code) => {
            expect(code).toBe(10);
        })
    });

    test('join Tx has not mined yet', () => {
        let provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', new ConnectorFactoryMock().getConnector());
        provider.init();
        return provider.join(1, 50).then((code) => {
            expect(code).toBe(0);
        })
    });


});