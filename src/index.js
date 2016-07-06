require('babel-polyfill');
var Logger = require('./modules/Logger');
var extend = require('./modules/Utils').extend;
var dequeryfy = require('./modules/Utils').dequeryfy;

var requireCondition = require('./modules/Decorators').requireCondition;
var Facebook = require('./modules/Facebook');
var version = require('./info.json').version;
var build = require('./info.json').build;

var fileModule = require('./modules/File');
var Game = require('./modules/Game');
var Connection = require('./modules/Connection');

var cookies = require('cookies-js');
var DEFAULT_CONFIGURATION = require('./stargate.conf.js');
// import bus from './modules/EventBus';

var stargateModules = {
    file: fileModule,
    game: new Game()
};
var LOG = new Logger('all', '[Stargate]');
var initialized = false;
var isStargateOpen = false;
var CUSTOM_CONF = {};

var initPromise;
var modulesLoaded;

/**
 * Stargate.initialize waits the cordova deviceready if runs in hybrid env
 * @param {Object} [configuration={DEVICE_READY_TIMEOUT: 5000, modules: [['file', {}]]}] - the object configuration
 * @param {Number} configuration.DEVICE_READY_TIMEOUT how much to wait the deviceready event in ms
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
            document.addEventListener('deviceready', function onready(e){
                resolve(e);
                document.removeEventListener('deviceready', onready);
            });

            // Reject the promise after 5s
            setTimeout(() => { 
                isStargateOpen = false;
                initialized = false;
                reject(['deviceready timeout', CUSTOM_CONF.DEVICE_READY_TIMEOUT].join(' ')); 
            }, CUSTOM_CONF.DEVICE_READY_TIMEOUT);
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

    return initPromise.then(() => moduleInitializer(moduleAndConf));
}

/**
 * Get the semantic version of stargate library
 * @static
 * @returns {String}
 */
function getVersion() {
    return [version, build];
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
 * @param {Object} ctx - only for testing purporse
 * @static
 * @returns {Boolean}
 */
function isHybrid(ctx){
    
    // Check url for hybrid query param
    
    var location = window.document.location;
    if (ctx) { 
        location = ctx.document.location;
    }
    var uri = location.href;
    var queryStringObject = dequeryfy(uri);
    var protocol = location.protocol;

    if (queryStringObject.hasOwnProperty('stargateVersion')) {
        window.localStorage.setItem('stargateVersion', queryStringObject.stargateVersion);
        cookies.set('stargateVersion', queryStringObject.stargateVersion, { expires: Infinity });
    }

    if (queryStringObject.hasOwnProperty('hybrid')) {
        window.localStorage.setItem('hybrid', 1);
        cookies.set('hybrid', '1', { expires: Infinity });
    }

    if ((protocol === 'file:' || protocol === 'cdvfile:')) {
        return true;
    }

    if (window.localStorage.getItem('hybrid')) {
        return true;
    }

    if (cookies.get('hybrid')) {
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
    localStorage.removeItem('hybrid');
    localStorage.removeItem('stargateVersion');
    cookies.expire('hybrid');
    cookies.expire('stargateVersion');
}

const MESSAGE_INITIALIZED = 'Call after Stargate.initialize() please';

module.exports = {
    initialize,
    getVersion,    
    facebookShare: Facebook.facebookShare,
    facebookLogin: Facebook.facebookLogin,
    addListener: requireCondition(isInitialized, 
                                    addListener, 
                                    null, 
                                    MESSAGE_INITIALIZED, 
                                    'warn'),
    removeListener: requireCondition(isInitialized, 
                                    removeListener, 
                                    null, 
                                    MESSAGE_INITIALIZED, 
                                    'warn'),
    checkConnection: requireCondition(isInitialized, 
                                    Connection.checkConnection, 
                                    null, 
                                    MESSAGE_INITIALIZED, 
                                    'warn'),
    file: stargateModules.file,
    game: stargateModules.game,
    initModule,
    isInitialized,
    isHybrid,
    isOpen,
    __deinit__
};