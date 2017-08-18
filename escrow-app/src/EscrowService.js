
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
    createRequest(title, amount, id){
        return this.provider.createRequest(title, amount, id);
    }
}