import abi from './abi';
import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'

import escrow_artifacts from './Escrow.json'

export default class Provider {
    constructor() {
        this.contractAddress = '0xeF36bADE312B5c40feFd522d74Ce6BCeE856F2DE'
        this.initMetamask();
    }

    initMetamask() {
        this.metaMaskEnabled = false;
        if (window.web3 !== 'undefined') {
            window.web3 = new Web3(window.web3.currentProvider);
            this.metaMaskEnabled = true;
        }
        this.Escrow = contract(escrow_artifacts);
        this.Escrow.setProvider(window.web3.currentProvider);

        return this.metaMaskEnabled;
    }

    getParticipants() {
        this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            return contractInstance.test.call().then(function (data, data2) {
                console.dir(data);
            });
        });
    }

    getOrders() {
        return this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            return contractInstance.getRequestsInfo.call().then(function (data) {
                return data.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        amount: item.amount,
                        usedPercentage: item.usedPercentage,
                        participantsCount: item.participantsCount
                    }
                });
            });
        });
    }

    join(id, amount) {
        return this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            return contractInstance.join.call(id, amount).then(function (result) {
                return true;
            });
        });
    }

    createRequest(title, amount, id) {
        return this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            return contractInstance.createRequest.call(title, amount, id).then(function (result) {
                return true;
            });
        });
    }


}