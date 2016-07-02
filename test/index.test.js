import cookies from 'cookies-js';
import Stargate from '../src/index';
import simulateEvent from './helpers/SimulateEvent';
import cordovaMock from './helpers/cordova';
import fileMock from './helpers/cordova-plugin-file';
import { UnzipMock } from './helpers/cordova-plugin-unzip';
import deviceMock from './helpers/cordova-plugin-device';

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
        cookies.expire('hybrid');
        Stargate.__deinit__();
    });

    it('Test public method interface', () => {
        expect(Stargate).toBeDefined();
        expect(Stargate.initialize).toBeDefined();        
    });

    fit('Test isHybrid false', () => {
        expect(Stargate.isHybrid()).toEqual(false);
    });

    fit('Test isHybrid true with cookie', () => {
        
        cookies.set('hybrid', 1);
        expect(Stargate.isHybrid()).toEqual(true);
    });

    fit('Test isHybrid true with localStorage', () => {
        localStorage.setItem('hybrid', 1);

        expect(Stargate.isHybrid()).toEqual(true);
    });

    it('Initialize hybrid should wait deviceready', (done) => {
        localStorage.setItem('hybrid', 1);
        
        Stargate.initialize().then((results) => {
            console.log('Results:', results);
            expect(results).toBeDefined();            
            done(); 
        });        
    });

    it('initModule Game after initialize', (done) => {
        var instanceUnzipMock = new UnzipMock();
        instanceUnzipMock.install();
        var GAME_CONF = {
            sdk_url: '', 
            dixie_url: '', 
            api: '', 
            ga_for_game_url: '', 
            gamifive_info_api: '', 
            bundle_games: []
        };

        Stargate.initialize();
        Stargate.initModule(['game', GAME_CONF]).then(() => {            
           done(); 
           instanceUnzipMock.uninstall();
        });

    });
});

describe('Stargate public interface tests 2', () => {

    var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5100;

    it('Initialize hybrid should FAIL after 5s without deviceready', (done) => {    
        localStorage.setItem('hybrid', 1);        
        cordovaMock.install(6);        

        expect(Stargate.isHybrid()).toEqual(true);

        Stargate.initialize().then((results) => { 
            cordovaMock.uninstall();
            done();
        }).catch((reason) => {
            expect(reason).toEqual('deviceready timeout 5000');
            expect(Stargate.isInitialized()).toEqual(false); 
            
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            cordovaMock.uninstall();

            done();
        });
    
    });

});