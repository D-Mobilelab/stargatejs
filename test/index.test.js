var cookies = require('cookies-js');
var Stargate = require('../src/index');
var API_URL_NET_INFO = require('../src/modules/Constants').API_URL_NET_INFO;
var simulateEvent = require('./helpers/SimulateEvent');
var cordovaMock = require('./helpers/cordova');
var fileMock = require('./helpers/cordova-plugin-file');
var unzipMock = require('./helpers/cordova-plugin-unzip');
var deviceMock = require('./helpers/cordova-plugin-device');
var utils = require('./helpers/utilities');
var manifestJSON = require('./helpers/manifest');

require('jasmine-ajax');

describe('Stargate public interface tests no hybrid', () => {

    beforeAll(() => {
        window.fakewindow = {
            document: {
                location: {
                    href: 'http://www.gameasy.com/?hybrid=1&stargateVersion=4',
                    protocol: 'http:'
                }
            }
        };        
    });

    afterAll(() => {
        window.fakewindow = null;
    });

    beforeEach(() => {
        jasmine.Ajax.install();
        cordovaMock.install(2); // deviceready event after 2000ms
    });

    afterEach(() => {             
        cordovaMock.uninstall();
        Stargate.__deinit__();
        Stargate.unsetMock('isHybrid');
        Stargate.unsetMock('netInfoIstance');
        Stargate.unsetMock('JSONPRequest');
        Stargate.unsetMock('getWebappOrigin');
        Stargate.unsetMock('fileModule');
        jasmine.Ajax.uninstall();
    });

    it('Initialize hybrid but deviceready after 2 seconds', (done) => {              
        var resolvedInit = jasmine.createSpy('resolvedInit');
        var SG_CONF = { DEVICE_READY_TIMEOUT: 500 };
        expect(Stargate.isHybrid()).toEqual(true);        

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

describe('Stargate public interface tests hybrid', () => {

    beforeAll(() => {
        window.fakewindow = {
            document: {
                location: {
                    href: 'http://www.gameasy.com/?hybrid=1&stargateVersion=4',
                    protocol: 'http:'
                }
            }
        };
    });

    afterAll(() => {
        window.fakewindow = null;
    });

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
        console.log(Stargate.game);
        expect(Stargate.game).toBeDefined();
        expect(Stargate.game.buildGameOver).toBeDefined();
        expect(Stargate.game.initialize).toBeDefined();
        expect(Stargate.game.needsUpdate).toBeDefined();
        expect(Stargate.game.getBundleGameObjects).toBeDefined();
        expect(Stargate.game.download).toBeDefined();
        expect(Stargate.game.remove).toBeDefined();
        expect(Stargate.game.removeAll).toBeDefined();
        expect(Stargate.game.list).toBeDefined();    
        expect(Stargate.game.isGameDownloaded).toBeDefined();
    });

    it('Test isHybrid false', () => {
        var prev = window.fakewindow.document.location.href;
        window.fakewindow.document.location.href = 'http://www.gameasy.com/!#/';
        expect(Stargate.isHybrid()).toEqual(false);
        window.fakewindow.document.location.href = prev;
    });

    it('Test isHybrid true', () => {

        expect(Stargate.isHybrid()).toEqual(true);
        expect(cookies.get('hybrid')).toEqual('1');
        expect(localStorage.getItem('hybrid')).toEqual('1');
    });

    it('Initialize hybrid should wait deviceready', (done) => {
        expect(window.cordova.file).toBeDefined();
        Stargate.setMock('getManifest', () => Promise.resolve(manifestJSON));
        Stargate.setMock('loadVHost', () => Promise.resolve({}));

        Stargate.initialize()
        .then((_results) => {                  
            expect(_results).toBeDefined();
            expect(Stargate.getWebappStartUrl()).toEqual('http://www2.gameasy.com/?hybrid=1&stargateVersion=4');
            expect(Stargate.getWebappOrigin()).toEqual('http://www2.gameasy.com');
            expect(Stargate.goToLocalIndex()).toEqual(`${window.cordova.file.applicationDirectory}www/${manifestJSON.start_url}`);
            Stargate.unsetMock('getManifest');
            Stargate.unsetMock('loadVHost');            
            done();
        })
        .catch((reason) => {
            expect(reason).not.toBeDefined();
            Stargate.unsetMock('getManifest');
            Stargate.unsetMock('loadVHost');         
            done();                    
        });
        
    });
});