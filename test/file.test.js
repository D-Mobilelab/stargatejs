var cordovaMock = require('./helpers/cordova');
var fileMock = require('./helpers/cordova-plugin-file');
var unzipMock = require('./helpers/cordova-plugin-unzip');
var deviceMock = require('./helpers/cordova-plugin-device');
var File = require('../src/modules/File');


describe('File interface test', () => {
    var TEST_FOLDER_DIR = '';
    beforeAll((done) => {
        TEST_FOLDER_DIR = '';
        var prom = new Promise((resolve, reject) => { 
            window.webkitRequestFileSystem(1, 5 * 1024 * 1024, resolve, reject); 
        }).then((fs) => {
            TEST_FOLDER_DIR = fs.root.toURL();
            console.log('TEST FOLDER DIR:', TEST_FOLDER_DIR);
            done();
        });
    }); 

    beforeEach(() => {
        cordovaMock.install(1);
        deviceMock.install();
        fileMock.install();        
        unzipMock.install();
    });

    afterEach(() => {
        deviceMock.uninstall();
        fileMock.uninstall();
        unzipMock.uninstall();
        cordovaMock.uninstall(1);
    });

    it('Test resolveLocalFileSystemURL to be supported', () => {
        expect(window.resolveLocalFileSystemURL).toBeDefined();
    });
    
    it('Test file module interface', () => {
        expect(File.createDir).toBeDefined();
    });

    it('file.resolveFS should resolve a path', function(done) {        
        File.resolveFS(TEST_FOLDER_DIR)
            .then((dirEntry) => {
                expect(dirEntry).toBeDefined();
                expect(dirEntry.isDirectory).toEqual(true);
                expect(dirEntry.isFile).toEqual(false);
                done();
            });
    });

    it('file.getMetadata should get the metadata of direntry', function(done) {        
        File.getMetadata(TEST_FOLDER_DIR)
            .then((meta) => {
                expect(meta.modificationTime).toBeDefined();
                expect(meta.size).toBeDefined();
                done();
            });
    });
});