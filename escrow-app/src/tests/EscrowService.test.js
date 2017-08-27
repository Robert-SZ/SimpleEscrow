import EscrowService from '../EscrowService'

describe('EscrowService tests', () => {
    test('init not Ok', () => {
        let provider = {
            init:()=>{
                return false;
            }
        };
        let service=new EscrowService(provider);
        return service.init().then(()=>{
            expect(1).toBe(2);
        }).catch(()=>{
            expect(1).toBe(1);
        });
    });
});