import connection from '../src/modules/Connection';
import simulateEvent from './helpers/SimulateEvent';
import netInfoMock from './helpers/cordova-plugin-network-information';

describe('Connection tests', () => {

    beforeEach(() => {
        // netInfoMock.install();
    });

    afterEach(() => {
        // netInfoMock.uninstall();
    });

    it("Test ConnectionChange offline if it's a browser", (done) => {
        connection.initialize();

        var onchange = jasmine.createSpy('connchange');
        connection.addListener('connectionchange', onchange);

        simulateEvent('offline', { _type: 'offline' }, 1, 'window');

        setTimeout(() => {
            expect(onchange).toHaveBeenCalledWith({ type: 'none', networkState: 'offline' });
            connection.removeListener('connectionchange', onchange);
            done();
        }, 600);
    });

    it('Test Connection online if it\'s a browser', (done) => {
        connection.initialize();

        var onchange = jasmine.createSpy('connchange');
        connection.addListener('connectionchange', onchange);

        simulateEvent('online', { _type: 'online' }, 1, 'window');

        setTimeout(() => {
            expect(onchange).toHaveBeenCalledWith({ type: 'none', networkState: 'online' });
            connection.removeListener('connectionchange', onchange);
            done();
        }, 600);
    });

    it('Test Connection online if cordova-network-information is defined', (done) => {
        netInfoMock.install();
        connection.initialize();

        var onchange = jasmine.createSpy('connchange');
        connection.addListener('connectionchange', onchange);

        simulateEvent('online', { _type: 'online' }, 1, 'window');

        setTimeout(() => {
           expect(onchange).toHaveBeenCalledWith({ type: 'wifi', networkState: 'online' });
           netInfoMock.uninstall();
           connection.removeListener('connectionchange', onchange);
           done();
       }, 600);
    });

    it('Test Connection offline if it\'s cordova-network-information defined', (done) => {
        netInfoMock.install();
        connection.initialize();

        var onchange = jasmine.createSpy('connchange');
        connection.addListener('connectionchange', onchange);

        // mock it
        window.navigator.connection.type = 'wifi';

        // Simulate Event
        simulateEvent('offline', { _type: 'offline' }, 1, 'window');

        setTimeout(() => {
            expect(onchange).toHaveBeenCalledWith({ type: 'wifi', networkState: 'offline' });
            done();
            connection.removeListener('connectionchange', onchange);
            netInfoMock.uninstall();
        }, 600);
    });
});