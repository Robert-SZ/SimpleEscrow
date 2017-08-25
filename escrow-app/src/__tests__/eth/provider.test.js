import {createCallMock} from '../helpers/mockHelper'
import Provider from '../../eth/provider';


jest.mock('truffle-contract', () => {
    let module= require('../helpers/mockHelper');
    let contractInstanceEmpty = {
        getRequestsInfo: {
            call: module.createCallMock([])
        }
    };
    let contractInstanceOneElement = {
        getRequestsInfo: {
            call: module.createCallMock([{c:[1]}])
        }
    };
    let contractInstanceReturnIds = {
        getRequestsInfo: {
            call: module.createCallMock([1])
        },
        requests:{
            call: module.createCallMock([{c:[1]},'Name',{c:[10]},{c:[0]},{c:[0]}])
        }
    };
    let atMock = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceEmpty);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceEmpty);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceOneElement);
        })
    }).mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
            resolve(contractInstanceReturnIds);
        })
    });

    return jest.fn().mockImplementation(() => {
        return {
            setProvider: jest.fn(),
            at: atMock
        };
    });
});

let web3 = {
    currentProvider: {},
    toAscii: (data)=>{return data.toString();}
};


describe('Etherium provider tests', () => {
    test('getOrders should return empty list if no ids in store', () => {
        let provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', web3);
        provider.init();
        return provider.getOrders().then((data) => {
            expect(data.length).toBe(0);
        })
    })

    test('getOrders should return empty list if store returns not empty ids list', () => {
        let provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', web3);
        provider.init();
        return provider.getOrders().then((data) => {
            expect(data[0].id).toBe(1);
        })
    })


});