"use strict";
var Logger = require("./Logger");
var requireCondition = require("./Decorators").requireCondition;
var LOG = new Logger("ALL", "[Facebook]");
var ERROR_MESSAGE  = "Cordova plugin for facebook is undefined";

function facebookLogin(scope, callbackSuccess, callbackError) {

    window.facebookConnectPlugin.login(
        scope.split(","),
        // success callback
        function (userData) {
            LOG.d("got userdata: ", userData);
            
            facebookConnectPlugin.getAccessToken(
                function(token) {
                    callbackSuccess({'accessToken' : token});
                },
                function(err) {
                    callbackError({'error': err});
                }
            );
        },

        // error callback
        function (error) {
            LOG.e("Got FB login error:", error);
            callbackError({'error': error});
        }
    );
};

function facebookShare(url, callbackSuccess, callbackError) {
    var options = {
        method: "share",
        href: url
    };
    
    window.facebookConnectPlugin.showDialog(
        options,        
        function(message){
            callbackSuccess({'message':message});
        },
        function(error){           
            callbackError({'error':error});
        }
    );
};

function facebookPluginIsDefined(){
    return typeof window.facebookConnectPlugin !== "undefined";
}

module.exports = {
    facebookLogin:requireCondition(facebookPluginIsDefined, facebookLogin, null, ERROR_MESSAGE, "warn"),
    facebookShare:requireCondition(facebookPluginIsDefined, facebookShare, null, ERROR_MESSAGE, "warn"),
    LOG:LOG
};