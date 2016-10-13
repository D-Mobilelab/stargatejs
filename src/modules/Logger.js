/**
 * @class
 * @alias module:src/modules/Logger
 * @param {String} label - OFF|DEBUG|INFO|WARN|ERROR|ALL
 * @param {String} tag - a tag to identify a log group. it will be prepended to any log function
 * @param {Object} [styles={background:"white",color:"black"}] -
 * @param {String} styles.background - background color CSS compatibile
 * @param {String} styles.color - color text CSS compatible
 * @example
 * var myLogger = new Logger("ALL", "TAG",{background:"black",color:"blue"});
 * myLogger.info("Somenthing", 1); // output will be > ["TAG"], "Somenthing", 1
 * myLogger.setLevel("off") // other values OFF|DEBUG|INFO|WARN|ERROR|ALL
 * */
class Logger{
    constructor(label, tag, styles = { background: 'white', color: 'black' }){
        this.levels = {
            ALL: 5,
            ERROR: 1,
            WARN: 2,
            INFO: 3,
            DEBUG: 4,
            OFF: 0
        };
        
        this.level = this.levels[label.toUpperCase()];
        this.styles = styles;
        this.tag = `%c${tag}`;
        this.styleString = `background:${this.styles.background};color:${this.styles.color};`;

        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.log = this.log.bind(this);
        this.error = this.error.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.__processArguments = this.__processArguments.bind(this);
    }

    info(){
        if (this.level >= this.levels.INFO) {
            console.info.apply(console, this.__processArguments(arguments));
        }
    }

    warn(){
        if (this.level >= this.levels.WARN) {
            console.warn.apply(console, this.__processArguments(arguments));
        }
    }

    log(){
        if (this.level >= this.levels.DEBUG) {
            console.log.apply(console, this.__processArguments(arguments));
        }
    }

    error(){
        if (this.level >= this.levels.ERROR) {
            console.error.apply(console, this.__processArguments(arguments));
        }
    }
    
    setLevel(label){
        this.level = this.levels[label.toUpperCase()];
    }

    __processArguments(args){
        let _args = [].slice.call(args);
        _args.unshift(this.styleString);
        _args.unshift(this.tag);
        return _args;
    }
}

export default Logger;