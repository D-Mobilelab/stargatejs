var cookies = require('cookies-js');
var Stargate = require('../src/index');
var simulateEvent = require('./helpers/SimulateEvent');
var cordovaMock = require('./helpers/cordova');
var fileMock = require('./helpers/cordova-plugin-file');
var unzipMock = require('./helpers/cordova-plugin-unzip');
var deviceMock = require('./helpers/cordova-plugin-device');
var utils = require('./helpers/utilities');
var manifestJSON = require('./helpers/manifest');
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
        // jasmine.clock().install();
    });

    afterAll(() => {
        // jasmine.clock().uninstall();
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

    beforeEach((done) => {
        cordovaMock.install(3);
        fileMock.install().then(done);
        deviceMock.install();
        unzipMock.install();
    });

    afterEach((done) => {
        unzipMock.uninstall();
        deviceMock.uninstall();
        fileMock.uninstall();
        cordovaMock.uninstall();                       

        Stargate.__deinit__();
        done();
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
        expect(window.cordova.file).toBeDefined();
        
        // Create directory and manifest.json
        utils.createDir(window.cordova.file.applicationStorageDirectory, 'www')
        .then((dirEntry) => 
            utils.createFileWithContent(dirEntry.toURL(), 
                            'manifest.json', 
                            JSON.stringify(manifestJSON))
        )
        .then((results) => {
            console.log('Manifest:', results);
            localStorage.setItem('hybrid', 1);
            
            Stargate.initialize().then((results) => {                
                expect(results).toBeDefined();
                utils.removeFile(window.cordova.file.applicationStorageDirectory + 'www/manifest.json');
                expect(Stargate.getWebappStartUrl()).toEqual('http://www2.gameasy.com/?hybrid=1&stargateVersion=4');
                expect(Stargate.getWebappOrigin()).toEqual('http://www2.gameasy.com');          
                done(); 
            }).catch((reason) => {
                console.error(reason);
                utils.removeFile(window.cordova.file.applicationStorageDirectory + 'www/manifest.json');
                done();                    
            });
        });       
        
    });
});