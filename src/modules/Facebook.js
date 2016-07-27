var Logger = require('./Logger');
var LOG = new Logger('ALL', '[Facebook]');
const ERROR_MESSAGE = 'Cordova plugin for facebook is undefined';

function facebookPluginIsDefined(){
    var pluginIsDefined = typeof window.facebookConnectPlugin !== 'undefined';
    if (!pluginIsDefined){
        LOG.warn(ERROR_MESSAGE);                
    }
    return pluginIsDefined;
}

export default class Facebook{
    /**
     * @param {Logger} [logger=new Logger("all", "[Facebook]")]
     */
    constructor(logger = LOG){
        this.LOG = logger;
    }

    facebookLogin(scope, callbackSuccess = () => {}, callbackError = () => {}){
        if (!facebookPluginIsDefined()) { return; }

        return new Promise((resolve, reject) => {
            window.facebookConnectPlugin.login(scope.split(','), 
            (userData) => {                
                resolve(userData);
            }, 
            (error) => {
                callbackError(error);
            });
        });      
    }

    getAccessToken(callbackSuccess = () => {}, callbackError = () => {}){
        if (!facebookPluginIsDefined()) { return; }
        return new Promise((resolve, reject) => {
            window.facebookConnectPlugin.getAccessToken(
                (token) => {
                    var result = { accessToken: token };
                    callbackSuccess(result);
                    resolve(result);
                },
                (err) => {
                    var result = { error: err };
                    callbackError(result);
                    reject(result);
                }
            );
        });       
    }

    facebookShare(url, callbackSuccess = () => {}, callbackError = () => {}){
        if (!facebookPluginIsDefined()) { return; }
        var options = {
            method: 'share',
            href: url
        };
        return new Promise((resolve, reject) => {
            window.facebookConnectPlugin.showDialog(
                options,        
                (message) => {
                    var result = { message };
                    callbackSuccess(result);
                    resolve(result);
                },
                (error) => {
                    var result = { error };
                    callbackError(result);
                    reject(result);
                }
            );
        });

    }

}