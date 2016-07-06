var EventBus = require('./EventBus');
var bus = new EventBus();
/**
 * Usage
 * Connection.initialize();
 * Connection.addListener("connectionchange", (event) => console.log(event.networkState,event.type));
 * Connection.checkConnection().networkState
 * Connection.checkConnection().type
 */
var UNSUPPORTED = true;

var connectionStatus = {    
    type: 'none', // wifi, 3g, 4g, none
    networkState: 'none' // online|offline
};

function addListener(type, listener){    
    if (type === 'connectionchange'){       
        bus.on(type, listener);
    }
}

function removeListener(type, listener){    
    if (type === 'connectionchange'){       
        bus.off(type, listener);
    }
}

function updateConnectionStatus(theEvent){
    connectionStatus.type = navigator.connection ? navigator.connection.type : 'none';
    connectionStatus.networkState = theEvent.type;
    bus.trigger('connectionchange', connectionStatus);    
}

function bindConnectionEvents(){
    if (UNSUPPORTED){
        // For some reasons document.addEventListener 
        // does not work in browsers (Safari, Chrome only works with window, FF both)
        // on cordova you MUST use document.addEventListener       
        window.addEventListener('offline', updateConnectionStatus, false);
        window.addEventListener('online', updateConnectionStatus, false);        
    } else {
        document.addEventListener('offline', updateConnectionStatus, false);
        document.addEventListener('online', updateConnectionStatus, false);    
    }
}

function initialize(){
    // call after device ready
    try {
        if (window.navigator.connection){
            connectionStatus.type = window.navigator.connection.type;
            
            if (window.navigator.connection.type !== 'none'){
                connectionStatus.networkState = 'online';
            }
            UNSUPPORTED = false;
        }
    } catch (e){
        // Browser case, unsupported or plugin cordova not installed
        UNSUPPORTED = true;
        connectionStatus.networkState = navigator.onLine ? 'online' : 'offline';
    } finally {        
        bindConnectionEvents();
    }
}

/**
 * Host reachable make a simple HEAD request 
 * to location.hostname
 * with a param to disable the cache
 * @returns {Boolean}
 */
function hostReachable() {
  // Handle IE and more capable browsers
    var xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');  

  // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open('HEAD', '//' + window.location.hostname + '/?rand=' + Math.floor((1 + Math.random()) * 0x10000), false);

  // Issue request and handle response
    try {
        xhr.send();
        return (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304));
    } catch (error) {
        return false;
    }

}

function checkConnection(){
    if (UNSUPPORTED){
        connectionStatus.networkState = navigator.onLine ? 'online' : 'offline';
    }
    return connectionStatus;
}

module.exports = {
    removeListener,
    addListener,
    initialize,
    checkConnection,
    hostReachable
};