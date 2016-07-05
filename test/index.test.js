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

describe('Stargate public interface tests', () => {


    beforeEach(() => {
       cordovaMock.install(3);
       fileMock.install();
       deviceMock.install();
    });

    afterEach(() => {
        deviceMock.uninstall();
        fileMock.uninstall();
        cordovaMock.uninstall();
                
        localStorage.removeItem('hybrid');
        localStorage.removeItem('stargateVersion');
        cookies.expire('hybrid');
        cookies.expire('stargateVersion');
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

describe('Stargate public interface tests 2', () => {
    // another describe beacause of timeout
    var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5100;

    beforeEach(() => {
       cordovaMock.install(6);
    });

    afterEach(() => {
                
        localStorage.removeItem('hybrid');
        localStorage.removeItem('stargateVersion');
        cookies.expire('hybrid');
        cookies.expire('stargateVersion');
        Stargate.__deinit__();
    });

    it('Initialize hybrid but deviceready after 5 seconds', (done) => {              

        expect(Stargate.isHybrid(ctx)).toEqual(true);
        var resolvedInit = jasmine.createSpy('resolvedInit');

        Stargate.initialize().then(resolvedInit).catch((reason) => {
            expect(reason).toEqual('deviceready timeout 5000');
            expect(Stargate.isInitialized()).toEqual(false); 
            
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            cordovaMock.uninstall();
            
            expect(resolvedInit).not.toHaveBeenCalled();
            done();
        });
    
    });

});