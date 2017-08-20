
import Provider from './eth/provider';

export default class EscrowService{
    constructor(){
        this.provider = new Provider();
        this.providerInited = false;
        this.providerInitCount = 0;
    }

    init(){
        return new Promise((resolve, reject)=>{
            let id = setInterval(()=>{
                if(this.providerInited>5){
                    reject();
                }
                this.providerInitCount++;
                this.providerInited = this.provider.init();
                if(this.providerInited){
                    clearInterval(id);
                    resolve();
                }
            }, 500);
        });
    }

    getOrders(){
        if(!this.providerInited)
            throw new Error('Provider must be inited. Please call init() before');
        return this.provider.getOrders();
    }
    join(id, amount){
        return this.provider.join(id, amount);
    }
    createRequest(title, amount, id){
        return this.provider.createRequest(title, amount, id);
    }
}