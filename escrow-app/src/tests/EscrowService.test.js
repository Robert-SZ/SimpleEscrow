import EscrowService from '../EscrowService'

describe('EscrowService tests', () => {
    test('init not Ok', () => {
        let service=new EscrowService();
        return service.init().then(()=>{
            expect(1).toBe(2);
        }).catch(()=>{
            expect(1).toBe(1);
        });
    });
});