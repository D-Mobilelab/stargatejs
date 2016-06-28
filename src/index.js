var Logger = require("./modules/Logger").Logger;
var extend = require("./modules/Utils").extend;
var requireCondition = require("./modules/Decorators").requireCondition;
var Facebook = require("./modules/Facebook");
var Connection = require("./modules/Connection");
var version = require("../package.json").version;
var File = require("./modules/File");
var Mfp = require("./modules/Mfp");

var LOG = new Logger("all","[Stargate]");
var hybrid = false;
var initialized = false;
var CONFIGURATION = {
    modules:[
                ["file", {}],
                ["mfp",{}]
            ]
};

var stargateModules = {
    "file":File    
};

var alreadyInitializedPromise;
function initialize(configuration){
    if(alreadyInitializedPromise){ return alreadyInitializedPromise; }
    
    CONFIGURATION = extend(CONFIGURATION, configuration || {});
    
    alreadyInitializedPromise = new Promise(function(resolve, reject){       
        
        document.addEventListener("deviceready", function(readyEvent){            
            var modulesLoaded = [];
            
            modulesLoaded = CONFIGURATION.modules.map(moduleInitializer);
            
            Connection.initialize();
            initialized = true;
            var results = Promise.all(modulesLoaded);
            resolve(results);
        });
    });
    
    return alreadyInitializedPromise;
}

function moduleInitializer(moduleAndConf){
    var name = moduleAndConf[0];
    var conf = moduleAndConf[1];
    if(stargateModules[name]){
        if(stargateModules[name].initialize){
            return stargateModules[name].initialize(conf);    
        }else{
            return Promise.resolve([name, true]);
        }                       
    } else { 
        LOG.w(name + " unsupported");
    }
}

function getVersion() {
    return version;
};

function isInitialized(){
    return initialized;
}

function isHybrid(){
    return hybrid;
}

function addListener(type, fn){
    Connection.addListener(type, fn);
}

var publicInterface = {
    initialize:initialize,
    getVersion:getVersion,    
    facebookShare:Facebook.facebookShare,
    facebookLogin:Facebook.facebookLogin,
    addListener:requireCondition(isInitialized, addListener),
    checkConnection:requireCondition(isInitialized, Connection.checkConnection),
    file:stargateModules.file,
    mfp:stargateModules.mfp,
    isInitialized:isInitialized,
    isHybrid:isHybrid
};

module.exports = publicInterface;