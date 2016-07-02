import Promise from 'promise-polyfill';
import Logger from './modules/Logger';
import {
    extend,
    dequeryfy
} from './modules/Utils';
import { requireCondition } from './modules/Decorators';
import Facebook from './modules/Facebook';
import { version } from '../package.json';

import fileModule from './modules/File';
import Game from './modules/Game';
import Connection from './modules/Connection';

import cookies from 'cookies-js';
import { DEFAULT_CONFIGURATION } from './stargate.conf.js';
import bus from './modules/EventBus';

var stargateModules = {
    file: fileModule,
    game: new Game()
};
var LOG = new Logger('all', '[Stargate]');
var initialized = false;
var isStargateOpen = false;
var CUSTOM_CONF;
const DEVICE_READY_TIMEOUT = 5000;

var initPromise;
var modulesLoaded;

/**
 * Stargate.initialize waits the cordova deviceready if runs in hybrid env
 * @param {Object} [configuration={}] - the object configuration
 * @param {Function} [callback=function(){}] - callback called when deviceready arrives
 * @returns {Promise<Object|Timeout>}
 */
function initialize(configuration = {}, callback = function(){}){
    if (initPromise){ 
        LOG.w('Initialized already called');
        return initPromise; 
    }
    
    CUSTOM_CONF = extend(DEFAULT_CONFIGURATION, configuration);
    
    // if isHybrid wait deviceready otherwise just call init 
    if (isHybrid()) {
        LOG.i('Hybrid init');
        initPromise = new Promise((resolve, reject) => {
            document.addEventListener('deviceready', resolve);

            // Reject the promise after 5s
            setTimeout(() => { 
                isStargateOpen = false;
                initialized = false;
                reject(['deviceready timeout', DEVICE_READY_TIMEOUT].join(' ')); 
            }, DEVICE_READY_TIMEOUT);
        }).then((readyEvent) => {
            LOG.i('ReadyEvent', readyEvent);
            modulesLoaded = CUSTOM_CONF.modules.map(moduleInitializer);
            Connection.initialize();   
            callback('OK');
            return Promise.all(modulesLoaded);            
        });
        
    } else {
        LOG.i('No hybrid init');
        modulesLoaded = CUSTOM_CONF.modules.map(moduleInitializer);
        Connection.initialize();
        initPromise = Promise.all(modulesLoaded);
    }
    
    return initPromise.then((results) => {
        initialized = true;
        isStargateOpen = true;
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
 * 
 * initModule waits the main initialization 
 * @param {Array<String|Object>} moduleAndConf - modulename and configuration object 
 */
function initModule(moduleAndConf){
    if (!initPromise) { return Promise.reject('Stargate.initialize needs to be called first'); }

    return initPromise.then((results) => moduleInitializer(moduleAndConf));
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
    var cordovaDefined = typeof window.cordova !== 'undefined';

    if ((protocol === 'file:' || protocol === 'cdvfile:') && cordovaDefined) {
        return true;
    }

    if (cookies.get('hybrid') && cordovaDefined) {
        return true;
    }
    
    if (queryStringObject.hasOwnProperty('hybrid') && cordovaDefined) {
        return true;
    }

    if (window.localStorage.getItem('hybrid') && cordovaDefined) {
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
 * Register a listener for a series of events. Callable after initialize
 * @param {String} type - connectionchange for example
 * @param {Function} fn - the function to call when the event occurs
 */
function addListener(type, fn){
    Connection.addListener(type, fn);
}

/**
 * Remoe a listener for a series of events
 * @param {String} type - connectionchange for example
 * @param {Function} fn - the function to call when the event occurs
 */
function removeListener(type, fn){
    Connection.removeListener(type, fn);
}

/**
 * just for test
 */
function __deinit__(){
    initPromise = null; 
    initialized = false; 
    isStargateOpen = false;
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
    file: fileModule,
    game: Game,
    initModule: moduleInitializer,
    isInitialized: isInitialized,
    isHybrid: isHybrid,
    __deinit__: __deinit__
}