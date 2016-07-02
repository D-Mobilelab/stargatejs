import simulateEvent from './SimulateEvent';

function CordovaMock(){}

 CordovaMock.prototype.install = function(devicereadyAfter = 6){
    window.cordova = {
        exec: function(success, fail, service, action, args){
            
        },
        getAppVersion: function(){

        },
        version: '4.1.1'
    };
    window.plugins = {};
    simulateEvent('deviceready', { pippo: 1, pappo: 2 }, devicereadyAfter * 1000);
};

CordovaMock.prototype.uninstall = function(){
    if (window.cordova){
        delete window.cordova;
        delete window.plugins;        
    }   
};

var cordovaMock = new CordovaMock();
export default cordovaMock;