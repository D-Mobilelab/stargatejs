/**
 * @class
 * @alias module:src/modules/Utils.Logger
 * @param {String} label - OFF|DEBUG|INFO|WARN|ERROR|ALL
 * @param {String} tag - a tag to identify a log group. it will be prepended to any log function
 * @param {Object} [styles={background:"white",color:"black"}] -
 * @param {String} styles.background - background color CSS compatibile
 * @param {String} styles.color - color text CSS compatible
 * @example
 * var myLogger = new Logger("ALL", "TAG",{background:"black",color:"blue"});
 * myLogger.i("Somenthing", 1); // output will be > ["TAG"], "Somenthing", 1
 * myLogger.setLevel("off") // other values OFF|DEBUG|INFO|WARN|ERROR|ALL
 * */
function Logger(label, tag, styles){
    Object.defineProperty(this, "levels", {
        value:{
            ALL:5,
            ERROR:1,
            WARN:2,
            INFO:3,
            DEBUG:4,
            OFF:0
        },
        writable:false,
        enumerable:true,
        configurable:true
    });

    this.level = this.levels[label.toUpperCase()];
    this.styles = styles || {background:"white",color:"black"}; //default
    this.tag = "%c " + tag + " ";
    this.isstaging = ("IS_STAGING = 1".slice(-1) === "1");

    this.styleString = "background:" + this.styles.background + ";" + "color:" + this.styles.color + ";";

    var argsToString = function() {
        if (arguments.length < 1) {
            return "";
        }
        var args = Array.prototype.slice.call(arguments[0]);
        var result = '';
        for (var i=0; i<args.length; i++) {
            if (typeof (args[i]) === 'object') {
                result += " " + JSON.stringify(args[i]);
            }
            else {
                result += " " + args[i];
            }
        }
        return result;
    };

    var consoleLog = window.console.log.bind(window.console, this.tag, this.styleString);
    var consoleInfo = window.console.info.bind(window.console, this.tag, this.styleString);
    var consoleError = window.console.error.bind(window.console, this.tag, this.styleString);
    var consoleWarn = window.console.warn.bind(window.console, this.tag, this.styleString);

    if (!this.isstaging) {
        consoleLog = function(){
            window.console.log("[D] [Stargate] "+argsToString.apply(null, arguments));
        };
        consoleInfo = function(){
            window.console.log("[I] [Stargate] "+argsToString.apply(null, arguments));
        };
        consoleError = function(){
            window.console.log("[E] [Stargate] "+argsToString.apply(null, arguments));
        };
        consoleWarn = function(){
            window.console.log("[W] [Stargate] "+argsToString.apply(null, arguments));
        };
    }

    //private and immutable
    Object.defineProperties(this, {
        "__d": {
            value: consoleLog,
            writable: false,
            enumerable:false,
            configurable:false
        },
        "__i": {
            value: consoleInfo,
            writable: false,
            enumerable:false,
            configurable:false
        },
        "__e": {
            value: consoleError,
            writable: false,
            enumerable:false,
            configurable:false
        },
        "__w": {
            value: consoleWarn,
            writable: false,
            enumerable:false,
            configurable:false
        }
    });

}

/**
 * Error Logging
 * @param {*} [arguments]
 * */
Logger.prototype.e = function(){

    if(this.level >= this.levels.ERROR){
        this.__e(arguments);
    }
};

/**
 * Info Logging
 * @param {*} [arguments]
 * */
Logger.prototype.i = function(){

    if(this.level >= this.levels.INFO){
        this.__i(arguments);
    }
};

/**
 * Warn Logging
 * @param {*} [arguments]
 * */
Logger.prototype.w = function(){
    if(this.level >= this.levels.WARN){
        this.__w(arguments);
    }
};

/**
 * Debug Logging
 * @param {*} [arguments]
 * */
Logger.prototype.d = function(){

    if(this.level >= this.levels.DEBUG){
        this.__d(arguments);
    }
};

/**
 * Set the minimum level for the logger
 * @param {String} label - OFF|DEBUG|INFO|WARN|ERROR|ALL
 * */
Logger.prototype.setLevel = function(label){
    this.level = this.levels[label.toUpperCase()];
};

module.exports = Logger;