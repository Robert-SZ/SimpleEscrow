import {default as Web3} from 'web3';

export default class EtheriumConnector {
    constructor() {
        this.web3 = new Web3(window.web3.currentProvider);
    }

    getFromAccount() {
        return this.web3.eth.accounts[0];
    }

    getCurrentProvider() {
        return this.web3.currentProvider;
    }

    toAscii(data){
        return this.web3.toAscii(data);
    }
}