function DeviceMock() {}

DeviceMock.prototype.install = function(){
    window.device = {};
    window.device.available = true;
    window.device.platform = 'iOS';
    window.device.version = '7.1';
    window.device.uuid = '599F9C00-92DC-4B5C-9464-7971F01F8370';
    window.device.cordova = '3.6.0';
    window.device.model = 'iPhone 5,1';
    window.device.name = 'iPhone 5,1 - deprecated';
};

DeviceMock.prototype.uninstall = function(){
    if (window.device){
        delete window.device;
    }
};

var deviceMock = new DeviceMock();

export default deviceMock;
