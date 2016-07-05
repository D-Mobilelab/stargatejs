import cookies from 'cookies-js';
import Stargate from '../src/index';
import simulateEvent from './helpers/SimulateEvent';
import cordovaMock from './helpers/cordova';
import fileMock from './helpers/cordova-plugin-file';
import { UnzipMock } from './helpers/cordova-plugin-unzip';
import deviceMock from './helpers/cordova-plugin-device';

// Used to replace-mock window in some cases   
var ctx = {
    document: {
        location: {
            href: 'http://mockit.com/?hybrid=1&stargateVersion=4',
            protocol: 'http:'
        }
    }
};

describe('Stargate public interface tests 1', () => {

    beforeAll(() => {
        //jasmine.clock().install();
    });

    afterAll(() => {
        //jasmine.clock().uninstall();
    });

    beforeEach(() => {
        cordovaMock.install(2); // deviceready event after 2000ms
    });

    afterEach(() => {             
        cordovaMock.uninstall();
        Stargate.__deinit__();
    });

    it('Initialize hybrid but deviceready after 2 seconds', (done) => {              
        var resolvedInit = jasmine.createSpy('resolvedInit');
        var SG_CONF = { DEVICE_READY_TIMEOUT: 500 };
        expect(Stargate.isHybrid(ctx)).toEqual(true);        

        Stargate.initialize(SG_CONF)
        .then((results) => {
            resolvedInit(results);
            expect(resolvedInit).not.toHaveBeenCalled();
            done();
        }).catch((reason) => {
            expect(reason).toEqual('deviceready timeout ' + SG_CONF.DEVICE_READY_TIMEOUT);
            expect(Stargate.isInitialized()).toEqual(false);
            expect(resolvedInit).not.toHaveBeenCalled();
            done();
        });    
    });
});

describe('Stargate public interface tests 2', () => {

    beforeEach(() => {
       cordovaMock.install(3);
       fileMock.install();
       deviceMock.install();
    });

    afterEach(() => {
        deviceMock.uninstall();
        fileMock.uninstall();
        cordovaMock.uninstall();                

        Stargate.__deinit__();
    });

    it('Test public method interface', () => {
        expect(Stargate).toBeDefined();
        expect(Stargate.initialize).toBeDefined();        
    });

    it('Test isHybrid false', () => {
        expect(Stargate.isHybrid()).toEqual(false);
    });

    it('Test isHybrid true', () => {
        
        expect(Stargate.isHybrid(ctx)).toEqual(true);
        expect(cookies.get('hybrid')).toEqual('1');
        expect(localStorage.getItem('hybrid')).toEqual('1');

    });

    it('Initialize hybrid should wait deviceready', (done) => {
        localStorage.setItem('hybrid', 1);
        
        Stargate.initialize().then((results) => {
            console.log('Results:', results);
            expect(results).toBeDefined();            
            done(); 
        });        
    });
});