
import Provider from './eth/provider';

export default class EscrowService{
    constructor(){
        this.provider = new Provider();
    }
    getOrders(){
        return this.provider.getOrders();
    }
    join(id, amount){
        return this.provider.join(id, amount);
    }
}