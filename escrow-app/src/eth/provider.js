import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'

import escrow_artifacts from './Escrow.json'

function sortOrders(item1, item2) {
    if(item2.id>item1.id){
        return -1;
    }
    return 1;
}

/**
 * This class provide access functions to Etherium test network(Ropsten)
 */
export default class Provider {
    constructor() {
        /**
         * Address of contract which was deployed to Ropsten
         * @type {string}
         */
        this.contractAddress = '0xa052B600320D45f9C65555939847807b7E86a696';
    }

    /**
     * Function checks installation of Metamask
     * @returns {boolean}
     */
    init() {
        this.metaMaskEnabled = false;
        if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);

            this.Escrow = contract(escrow_artifacts);
            this.Escrow.setProvider(window.web3.currentProvider);

            this.metaMaskEnabled = true;
        }
        return this.metaMaskEnabled;
    }

    /**
     * Get array of requests
     * @returns {Promise.<TResult>}
     */
    getOrders() {
        return this.Escrow.at(this.contractAddress).then(contractInstance => {
            return contractInstance.getRequestsInfo.call().then((data) => {
                return data.map(item => {
                    return item.c[0]
                });
            });
        }).then(ids => {
            return this.Escrow.at(this.contractAddress).then(contractInstance => {
                return new Promise((resolve, reject) => {
                    let result = [];
                    let idsCount = 0;
                    ids.forEach(id => {
                        contractInstance.requests.call(id).then(data => {
                            let element = {
                                id: data[0].c[0],
                                title: window.web3.toAscii(data[1]),
                                amount: data[2].c[0],
                                usedPercentage: data[3].c[0],
                                paticipantsCount: data[4].c[0],
                            };
                            result.push(element);
                            idsCount++;
                            if (idsCount === ids.length) {
                                resolve(result.sort(sortOrders));
                            }
                        }).catch(error => {
                            reject(error);
                        })
                    });

                });

            })
        });
    }

    /**
     * Join Seller to Buyers request
     * @param id
     * @param amount
     * @returns {Promise.<TResult>|*|{anyOf}}
     */
    join(id, amount) {
        return this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            let requestId = +id;
            let value = +amount;
            return contractInstance.join(requestId, value, {gas: 140000, from: window.web3.eth.accounts[0]}).then(function (result) {
                console.dir(result);
                return true;
            });
        });
    }

    /**
     * Create request for delivery
     * @param title
     * @param amount
     * @param id
     * @returns {Promise.<TResult>|*|{anyOf}}
     */
    createRequest(title, amount, id) {
        return this.Escrow.at(this.contractAddress).then(function (contractInstance) {
            return contractInstance.createRequest(title, amount, id, {gas: 140000, from: window.web3.eth.accounts[0]}).then(function (result) {
                console.dir(result);
                return {
                    id: id,
                    title: title,
                    amount: amount,
                    usedPercentage: 0,
                    paticipantsCount: 0
                }
            });
        });
    }


}