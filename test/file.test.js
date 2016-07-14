var cordovaMock = require('./helpers/cordova');
var fileMock = require('./helpers/cordova-plugin-file');
var unzipMock = require('./helpers/cordova-plugin-unzip');
var deviceMock = require('./helpers/cordova-plugin-device');
var File = require('../src/modules/File');
var utils = require('./helpers/utilities');
describe('File interface test', () => {

    var TEST_FOLDER_DIR = '';
    beforeAll((done) => {
        TEST_FOLDER_DIR = '';
        var SIZE = 5 * 1024 * 1024;
        var TYPE = 0;
        var prom = new Promise((resolve, reject) => { 
            window.webkitRequestFileSystem(TYPE, SIZE, resolve, reject); 
        }).then((fs) => {
            TEST_FOLDER_DIR = fs.root.toURL();
            console.log('TEST FOLDER DIR CREATED:', SIZE, (TYPE === 0 ? 'TEMP' : 'PERS'), TEST_FOLDER_DIR);
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
        cordovaMock.uninstall();
    });

    it('Test resolveLocalFileSystemURL support', () => {
        expect(window.resolveLocalFileSystemURL).toBeDefined();
    });
    
    it('File module interface', () => {
        expect(File.createDir).toBeDefined();
        expect(File.write).toBeDefined();
        expect(File.removeFile).toBeDefined();
        expect(File.removeDir).toBeDefined();
    });

    it('resolveFS() should resolve a path', (done) => {        
        File.resolveFS(TEST_FOLDER_DIR)
            .then((dirEntry) => {
                expect(dirEntry).toBeDefined();
                expect(dirEntry.isDirectory).toEqual(true);
                expect(dirEntry.isFile).toEqual(false);
                done();
            });
    });

    it('getMetadata() should get the metadata of direntry', (done) => {        
        File.getMetadata(TEST_FOLDER_DIR)
            .then((meta) => {
                expect(meta.modificationTime).toBeDefined();
                expect(meta.size).toBeDefined();
                done();
            });
    });

    it('write() should write', (done) => {
        function write(){
            File.write(TEST_FOLDER_DIR + 'filename.txt', 'content')
                .then((res) => {
                    expect(res.isFile).toEqual(true);
                    expect(res.isDirectory).toEqual(false);
                    done();
                });
        }

        File.createFile(TEST_FOLDER_DIR, 'filename.txt')
            .then(write).catch((reason) => {
                expect(true).toEqual(false);
                done();
            });    
        
    });

    it('readFile() should read', (done) => {
        utils.createFileWithContent(TEST_FOLDER_DIR, 'simplefile.txt', 'content')
                .then(() => {
                    return File.readFile(TEST_FOLDER_DIR + 'simplefile.txt');
                })
                .then((content) => {                    
                    expect(content).toEqual('content');
                    utils.removeFile(TEST_FOLDER_DIR + 'simplefile.txt').then(done);
                })
                .catch((reason) => {
                    utils.removeFile(TEST_FOLDER_DIR + 'simplefile.txt').then(done);                    
                });
    });
    
    it('readFileAsJSON() should read a json', (done) => {
        utils.createFileWithContent(TEST_FOLDER_DIR, 'simplefile.json', JSON.stringify({ aa: 'bb' }))
                .then(() => File.readFileAsJSON(TEST_FOLDER_DIR + 'simplefile.json'))
                .then((content) => {                    
                    expect(content).toEqual({ aa: 'bb' });
                    utils.removeFile(TEST_FOLDER_DIR + 'simplefile.json').then(done);
                })
                .catch((reason) => {
                    utils.removeFile(TEST_FOLDER_DIR + 'simplefile.json').then(done);                    
                });
    });
});