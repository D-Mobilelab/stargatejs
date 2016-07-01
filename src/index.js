import Promise from 'promise-polyfill';
import Logger from './modules/Logger';
import {
    extend,
    dequeryfy
} from './modules/Utils';
import { requireCondition } from './modules/Decorators';
import Facebook from './modules/Facebook';
import Connection from './modules/Connection';
import { version } from '../package.json';
import File from './modules/File';
import Game from './modules/Game';
import cookies from 'cookies-js';
import { CONFIGURATION } from './stargate.conf.js';

var stargateModules = {
    file: File,
    game: Game
};
var LOG = new Logger('all', '[Stargate]');
var hybrid = false;
var initialized = false;
var isStargateOpen = false;
var _CONFIGURATION;

var alreadyInitializedPromise;
/**
 * Stargate.initialize waits the cordova deviceready
 * @param {Object} [configuration={}] - the object configuration
 * @param {Function} [callback=function(){}] - callback called when deviceready arrives
 * @returns {Promise}
 */
function initialize(configuration = {}, callback = function(){}){
    if (alreadyInitializedPromise){ 
        LOG.w('Stargate Already initialized');
        return alreadyInitializedPromise; 
    }
    
    _CONFIGURATION = extend(CONFIGURATION, configuration);    
    
    alreadyInitializedPromise = new Promise((resolve, reject) => {       
        
        document.addEventListener('deviceready', (readyEvent) => {
            LOG.i('ReadyEvent:', readyEvent);          
            var modulesLoaded = [], 
                results;
            
            modulesLoaded = _CONFIGURATION.modules.map(moduleInitializer);            
            results = Promise.all(modulesLoaded);
            resolve(results);
            Connection.initialize();
        });
    });
    
    return alreadyInitializedPromise.then((results) => {
        isStargateOpen = true;
        initialized = true;
        callback(results);
        return results;
    });
}

function moduleInitializer(moduleAndConf){
    var name = moduleAndConf[0];
    var conf = moduleAndConf[1];
    if (stargateModules[name]){
        if (stargateModules[name].initialize){
            return stargateModules[name].initialize(conf);    
        } else {
            return Promise.resolve([name, true]);
        }                       
    } else { 
        LOG.w([name, 'unsupported'].join(' '));
        return Promise.reject([name, 'unsupported'].join(' '));
    }
}

/**
 * Get the semantic version of stargate library
 * @static
 * @returns {String}
 */
function getVersion() {
    return version;
}

/**
 * Returns true if the deviceready event has arrived
 * @static
 * @returns {Boolean}
 */
function isInitialized(){
    return initialized;
}

/**
 * Check if stargate is running in hybrid environment: 
 * in order:check the protocol, check cookie if any, localStorage if any
 * @static
 * @returns {Boolean}
 */
function isHybrid(){
    // check url for hybrid query param
    var uri = window.document.location.href;
    var queryStringObject = dequeryfy(uri);
    var protocol = window.document.location.protocol;

    if (protocol === 'file:' || protocol === 'cdvfile:') {
        return true;
    }

    if (cookies.get('hybrid')) {
        return true;
    }
    
    if (queryStringObject.hasOwnProperty('hybrid')) {
        return true;
    }

    if (window.localStorage.getItem('hybrid')) {
        return true;
    }

    return false;
}

/**
 * @deprecated
 */
function isOpen (){
    return isStargateOpen;
}

/**
 * register a listener for a series of events
 * @param {String} type - connectionchange for example
 * @param {Function} fn - the function to call when the event occurs
 */
function addListener(type, fn){
    Connection.addListener(type, fn);
}

/**
 * register a listener for a series of events
 * @param {String} type - connectionchange for example
 * @param {Function} fn - the function to call when the event occurs
 */
function removeListener(type, fn){
    Connection.removeListener(type, fn);
}

const MESSAGE_INITIALIZED = 'Call after Stargate.initialize() please';
export default {
    initialize: initialize,
    getVersion: getVersion,    
    facebookShare: Facebook.facebookShare,
    facebookLogin: Facebook.facebookLogin,
    addListener: requireCondition(isInitialized, addListener, null, MESSAGE_INITIALIZED, 'warn'),
    removeListener: requireCondition(isInitialized, removeListener, null, MESSAGE_INITIALIZED, 'warn'),
    checkConnection: requireCondition(isInitialized, Connection.checkConnection, null, MESSAGE_INITIALIZED, 'warn'),
    file: File,
    game: Game,
    isInitialized: isInitialized,
    isHybrid: isHybrid
}