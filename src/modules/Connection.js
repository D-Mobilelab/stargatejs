"use strict";
/**
 * Usage
 * Connection.initialize();
 * Connection.addListener("connectionchange", (event) => console.log(event.networkState,event.type));
 * Connection.checkConnection().networkState
 * Connection.checkConnection().type
 */

var EventBus = require("./EventBus");
var bus = new EventBus();
var BROWSER = true;

var connectionStatus = {    
    type:"none", // wifi, 3g, 4g, none
    networkState:"none" // online|offline
};

function addListener(type, listener){    
    if(type == "connectionchange"){       
        bus.on(type, listener);
    }
};

function removeListener(type, listener){    
    if(type == "connectionchange"){       
        bus.remove(type, listener);
    }
};

function updateConnectionStatus(theEvent){
    connectionStatus.type = navigator.connection ? navigator.connection.type : "none";
    connectionStatus.networkState = theEvent.type;
    bus.trigger("connectionchange", connectionStatus);    
}

function bindConnectionEvents(){
    if(BROWSER){
        // For some reasons document.addEventListener 
        // does not work in browsers (Safari, Chrome only works with window, FF both)
        // on cordova you MUST use document.addEventListener (only with FF works in both way)        
        window.addEventListener("offline", updateConnectionStatus, false);
        window.addEventListener("online", updateConnectionStatus, false);
    } else {
        document.addEventListener("offline", updateConnectionStatus, false);
        document.addEventListener("online", updateConnectionStatus, false);    
    }
}

function initialize(){
    // call after device ready
    try{
        if(window.navigator.connection){
            connectionStatus.type = window.navigator.connection.type;
            
            if(window.navigator.connection.type !== "none"){
                connectionStatus.networkState = "online";
            }
            BROWSER = false;
        }
    }catch(e){
        // Browser case or plugin cordova not installed
        BROWSER = true;
        connectionStatus.networkState = navigator.onLine ? "online" : "offline";
    }
    
    bindConnectionEvents();
}

function hostReachable() {

  // Handle IE and more capable browsers
  var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
  var status;

  // Open new request as a HEAD to the root hostname with a random param to bust the cache
  xhr.open("HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);

  // Issue request and handle response
  try {
    xhr.send();
    return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
  } catch (error) {
    return false;
  }

}

function checkConnection(){
    if(BROWSER){
        connectionStatus.networkState = navigator.onLine ? "online" : "offline";
    }
    return connectionStatus;
}

module.exports = {
    removeListener:removeListener,
    addListener:addListener,
    initialize:initialize,
    checkConnection:checkConnection,
    hostReachable:hostReachable
}