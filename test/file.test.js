import cordovaMock from './helpers/cordova';
import fileMock from './helpers/cordova-plugin-file';
import unzipMock from './helpers/cordova-plugin-unzip';
import deviceMock from './helpers/cordova-plugin-device';
import File from '../src/modules/File';


describe('File interface test', () => {    
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
    
    it('Test file module', () => {
        expect(File.createDir).toBeDefined();
    });
});