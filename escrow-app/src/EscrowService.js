import Provider from './eth/provider';

let _ordersIdsList = undefined;

function getNextId() {
    if (!_ordersIdsList || _ordersIdsList.length === 0)
        return 1;
    let lastId = _ordersIdsList[_ordersIdsList.length - 1];
    return ++lastId;
}

export default class EscrowService {
    constructor() {
        this.provider = new Provider('0x0F6cBC1E9169D079cEEd11c0Ac67544520E5bf67', window.web3);
        this.providerInited = false;
        this.providerInitCount = 0;
    }

    init() {
        return new Promise((resolve, reject) => {
            let id = setInterval(() => {
                if (this.providerInitCount > 5) {
                    reject();
                }
                this.providerInitCount++;
                this.providerInited = this.provider.init();
                if (this.providerInited) {
                    clearInterval(id);
                    resolve();
                }
            }, 500);
        });
    }

    getOrders() {
        if (!this.providerInited)
            throw new Error('Provider must be inited. Please call init() before');
        return this.provider.getOrders().then(orders => {
            _ordersIdsList = orders.map(item => item.id);
            return orders;
        });

    }

    join(id, amount) {
        return this.provider.join(id, amount);
    }

    createRequest(title, amount) {
        return this.provider.createRequest(title, amount, getNextId());
    }
}