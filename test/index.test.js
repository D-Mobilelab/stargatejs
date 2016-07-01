import Stargate from '../src/index';
import { SimulateEvent } from './helpers/helpers';

describe('Stargate public interface tests', () => {

    
    beforeEach(() => {        
        SimulateEvent('deviceready', { pippo: 1, pappo: 2 }, 100);
    });

    afterEach(() => {
        
    });

    it('Test public method interface', (done) => {
        expect(Stargate).toBeDefined();
        expect(Stargate.initialize).toBeDefined();
        done();
    });

    it('Initialize should be resolved as promise', (done) => {
        Stargate.initialize().then((results) => {
            console.log('Results:', results);
            expect(results).toBeDefined();
            done(); 
        });
    });

    it('Initialize should be resolved as promise', (done) => {
        Stargate.initialize({ modules: ['game', {}] }).then((results) => {
            console.log('Results:', results);
            expect(results).toBeDefined();
            done();
        });
    });
});