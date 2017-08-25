import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'

import escrow_artifacts from './Escrow.json'

function sortOrders(item1, item2) {
    if (item2.id > item1.id) {
        return -1;
    }
    return 1;
}

/**
 * This class provide access functions to Etherium test network(Ropsten)
 */
export default class Provider {
    constructor(contractAddress, web3provider) {
        /**
         * Address of contract which was deployed to Ropsten
         * @type {string}
         */
        this.contractAddress = contractAddress;
        this.web3 = web3provider;
    }

    /**
     * Function checks installation of Metamask
     * @returns {boolean}
     */
    init() {
        this.metaMaskEnabled = false;
        if (this.web3) {
            this.web3 = new Web3(this.web3.currentProvider);

            this.Escrow = contract(escrow_artifacts);
            this.Escrow.setProvider(this.web3.currentProvider);

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
                    if (!ids || ids.length === 0) {
                        resolve([]);
                    }
                    ids.forEach(id => {
                        contractInstance.requests.call(id).then(data => {
                            let element = {
                                id: data[0].c[0],
                                title: this.web3.toAscii(data[1]),
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
        return this.Escrow.at(this.contractAddress).then((contractInstance) => {
            let requestId = +id;
            let value = +amount;
            let from = window.web3.eth.accounts[0];
            return contractInstance.join(requestId, value, {
                gas: 240000,
                from: from
            }).then((result) => {
                console.dir(result);
                return this.Escrow.at(this.contractAddress).then(contractInstance => {
                    return contractInstance.txlog.call(from).then(data => {
                        let resultCode = data.c[0];
                        return resultCode;
                    });
                });
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
        return this.Escrow.at(this.contractAddress).then((contractInstance) => {
            let from = window.web3.eth.accounts[0];
            return contractInstance.createRequest(title, amount, id, {
                gas: 240000,
                from: from
            }).then((result) => {
                console.dir(result);
                let resultObject = {
                    id: id,
                    title: title,
                    amount: amount,
                    usedPercentage: 0,
                    paticipantsCount: 0
                };
                return this.Escrow.at(this.contractAddress).then(contractInstance => {
                    return contractInstance.txlog.call(from).then(data => {
                        let resultCode = data.c[0];
                        resultObject.resultCode = resultCode;
                        return resultObject;
                    });
                });

            });
        });
    }


}