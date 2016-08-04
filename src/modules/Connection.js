import EventBus from './EventBus';
import { queryfy } from './Utils';
var bus = new EventBus();

/**
 * Connection module. A simple module to check if connectivity is on or off
 * Usage:
 * @example
 * Connection.initialize();
 * Connection.addListener((event) => console.log(event.networkState, event.type));
 * Connection.removeListener(listenerRegisteredBefore);
 * Connection.checkConnection().networkState
 * Connection.checkConnection().type
 */
class NetworkInfo{
   
    constructor(){
        
        /** type {object} */
        this.connectionStatus = {    
            type: 'none',         // online|offline
            networkState: 'none'  // wifi, 3g, 4g, none
        };
        
        /** type {boolean} */
        this.UNSUPPORTED = true;
    }

    /**
     * bind listeners to online|offline events
     * if it runs in cordova context must be called after deviceready
     * and cordova-plugin-network should be installed
     */
    initialize(){        
        try {
            // connection is present in new browsers
            if (window.navigator.connection){
                if (window.navigator.connection.type){
                    this.connectionStatus.networkState = window.navigator.connection.type;
                }
                this.UNSUPPORTED = false;
            }
        } catch (e){
            // Browser case, unsupported or plugin cordova not installed
            this.UNSUPPORTED = true;
        } finally {
            this.connectionStatus.type = navigator.onLine ? 'online' : 'offline';
            this.__bindConnectionEvents__();
        }
    }

    checkConnection(){
        if (this.UNSUPPORTED){
            this.connectionStatus.type = navigator.onLine ? 'online' : 'offline';
        }
        return this.connectionStatus;
    }

    /**
     * Register a function to be called on connection change
     * @param {function} listener - the listener to register 
     */
    addListener(listener){               
        bus.on('connectionchange', listener);      
    }

    /**
     * UnRegister a function
     * @param {function} listener - the listener to unregister 
     */
    removeListener(listener){
        bus.off('connectionchange', listener);
    }

    /**
     * Host reachable make a simple sync HEAD request 
     * to location.hostname or custom url
     * with a param to disable the cache
     * @param {string} [url=window.location.hostname] - simple url to call without querystring
     * @returns {boolean}
     */
    hostReachable(url) {
        // Handle IE and more capable browsers
        var xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');  
        var disableCache;
        if (!url){
            disableCache = Math.floor((1 + Math.random()) * 0x10000);       
            url = `${window.location.protocol}//${window.location.hostname}`;
        }

        var querystring = {
            rand: disableCache
        };
        
        // Open new request as a HEAD to the root hostname with a random param to bust the cache
        xhr.open('HEAD', queryfy(url, querystring), false);

        // Issue request and handle response
        try {
            xhr.send();
            return (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304));
        } catch (error) {
            return false;
        }
    }

    /**
     * bind connection events
     * it's called inside initialize should not be called
     * @access private
     */
    __bindConnectionEvents__() {
        if (this.UNSUPPORTED){
            // For some reasons document.addEventListener 
            // does not work in browsers (Safari, Chrome works only with window, FF both)
            // on cordova you MUST use document.addEventListener
            window.addEventListener('offline', this.__updateConnectionStatus__.bind(this), false);
            window.addEventListener('online', this.__updateConnectionStatus__.bind(this), false);        
        } else {
            document.addEventListener('offline', this.__updateConnectionStatus__.bind(this), false);
            document.addEventListener('online', this.__updateConnectionStatus__.bind(this), false);    
        }
    }
    
    /**
     * update the internal variable connectionStatus
     * it's called inside initialize should not be called
     * @access private
     */
    __updateConnectionStatus__(theEvent){
        this.connectionStatus.type = theEvent.type;
        this.connectionStatus.networkState = navigator.connection ? navigator.connection.type : 'none';
        bus.trigger('connectionchange', this.connectionStatus);    
    }
}

export default NetworkInfo;