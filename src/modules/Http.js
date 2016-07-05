import Promise from 'promise-polyfill';
import Logger from './Logger';
import { getType, extend } from './Utils';
import connection from './Connection';

var LOG = new Logger('ALL', '[Request]');
/**
 * getJSON
 *
 * @alias module:src/modules/Http.getJSON
 * @param {String} url - for example http://jsonplaceholder.typicode.com/comments?postId=1
 * @returns {Promise<Object|String>} the string error is the statuscode
 * */
function getJSON(url){
    url = encodeURI(url);
    var xhr = typeof XMLHttpRequest !== 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    var responseTypeAware = 'responseType' in xhr;

    xhr.open('GET', url, true);
    if (responseTypeAware) {
        xhr.responseType = 'json';
    }

    var daRequest = new Promise(function(resolve, reject){
        xhr.onreadystatechange = function(){
            var result;
            if (xhr.readyState === 4) {
                try {
                    result = responseTypeAware ? xhr.response : JSON.parse(xhr.responseText);
                    resolve(result);
                } catch (e){
                    reject(e);
                }
            }
        };
    });

    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.send();
    return daRequest;
}

/**
 * Make a jsonp request, remember only GET
 * The function create a tag script and append a callback param in querystring.
 * The promise will be reject after 3s if the url fail to respond
 *
 * @class
 * @alias module:src/modules/Http.jsonpRequest
 * @example
 * request = new jsonpRequest("http://www.someapi.com/asd?somequery=1");
 * request.then(...)
 * @param {String} url - the url with querystring but without &callback at the end or &function
 * @returns {Promise<Object|String>}
 * */
function jsonpRequest(url){
    var self = this;
    self.timeout = 3000;
    self.called = false;
    if (window.document) {
        var ts = Date.now();
        self.scriptTag = window.document.createElement('script');
        url += '&callback=window.__jsonpHandler_' + ts;
        self.scriptTag.src = url;
        self.scriptTag.type = 'text/javascript';
        self.scriptTag.async = true;

        self.prom = new Promise(function(resolve, reject){
            var functionName = '__jsonpHandler_' + ts;
            window[functionName] = function(data){
                self.called = true;
                resolve(data);
                self.scriptTag.parentElement.removeChild(self.scriptTag);
                delete window[functionName];
            };
            // reject after a timeout
            setTimeout(function(){
                if (!self.called){
                    reject('Timeout jsonp request ' + ts);
                    self.scriptTag.parentElement.removeChild(self.scriptTag);
                    delete window[functionName];
                }
            }, self.timeout);
        });
        // the append start the call
        window.document.getElementsByTagName('head')[0].appendChild(self.scriptTag);        
    }
}

/**
 * getImageRaw from a specific url
 *
 * @alias module:src/modules/Utils.getImageRaw
 * @param {Object} options - the options object
 * @param {String} options.url - http or whatever
 * @param {String} [options.responseType="blob"] - possible values arraybuffer|blob
 * @param {String} [options.mimeType="image/jpeg"] - possible values "image/png"|"image/jpeg" used only if "blob" is set as responseType
 * @param {Function} [_onProgress=function(){}]
 * @returns {Promise<Blob|ArrayBuffer|Error>}
 */
function getImageRaw(options, _onProgress){
    var onProgress = _onProgress || function(){};
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('GET', options.url, true);
        request.responseType = options.responseType || 'blob';
        request.withCredentials = true;
        function transferComplete(){
            var result;
            switch (options.responseType){
            case 'blob':
                result = new Blob([this.response], { type: options.mimeType || 'image/jpeg' });
                break;
            case 'arraybuffer':
                result = this.response;
                break;
            default:
                result = this.response;
                resolve(result);
                break;

            }
        }

        var transferCanceled = reject;
        var transferFailed = reject;

        request.addEventListener('progress', onProgress, false);
        request.addEventListener('load', transferComplete, false);
        request.addEventListener('error', transferFailed, false);
        request.addEventListener('abort', transferCanceled, false);

        request.send(null);
    });

}

var defaultOptions = {
    method: 'GET',
    url: '',
    attempt: 1,
    responseType: 'json', // json, document, "", text, blob, arraybuffer
    dataType: 'json', // the type of data sent(if any)
    callback(){},
    headers: {},
    data: null,
    withCredentials: false,
    async: true,
    mimeType: '', // image/png"|"image/jpeg|text/plain mimeType only used when responseType is blob!
    retryAfter: 0, // ms, used if attempt > 1
    onProgress(){}
};

/**
 * The Http class
 * @constructor
 * @alias module:src/Http
 * @param {Object} requestParams - object where you can specify the options of the request
 * @param {String} [requestParams.type=POST] - the type of the request: possible values POST, GET, PUT, DELETE
 * @param {String} requestParams.url - the url to request for
 * @param {Object} [requestParams.headers={"Accept":"application/json"}] - the headers object
 * @param {String} [requestParams.timeout=2000] - the timeout of the request in ms
 * @param {Boolean} [requestParams.async=true] -
 * @returns {Promise}
 * */
function Http(options, callback){  
    var self = this;
    this.options = extend(defaultOptions, options);  
    this.calls = [];
    this.callback = callback || function(){};
    this.promise = new Promise(function(resolve, reject){
        self.do(resolve, reject);
    });
}

Http.prototype.do = function(resolve, reject){
	    var self = this;
	    if (this.options.attempt === 0){      
    var lastCall = this.calls[this.calls.length - 1];
    reject({ status: lastCall.status, statusText: lastCall.statusText });
    self.callback(lastCall.status);
    clearTimeout(self.timeoutID);
    self.timeoutID = null;
    return;
}
  
    var xhr;
    if (Http.isXMLHttpRequestSupported()) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
      xhr = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  
  // store this request in the object
    this.calls.push(xhr);
  
  // OPEN
    xhr.open(this.options.method.toUpperCase(),
           this.options.url, 
           this.options.async);
  
  // SENDING JSON?
    if (self.options.dataType === 'json'){
      self.options.data = JSON.stringify(self.options.data);
      xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');        
  }  
  
  // CUSTOM HEADERS
    if (this.options.headers){
      addCustomHeaders(this.options.headers, xhr);    
  }
  
  // CORS
    if (this.options.withCredentials && Http.isCORSSupported()){
      xhr.withCredentials = true;    
  }  
  
  // check responseType support
    var responseTypeAware = 'responseType' in xhr;
  
    if (responseTypeAware){    
      xhr.responseType = this.options.responseType;    
  }
  
    LOG.d('responseType setted to ', xhr.responseType);
  
    xhr.onreadystatechange = function(event){
  		    if (xhr.readyState === xhr.DONE) {
      if (xhr.status >= 200 && xhr.status < 400) {                    
                if (xhr.responseType === 'blob'){
                    LOG.d('BLOB CASE!');
                    
                    // try to infer mimetype from extension?
                    var blob = new Blob([xhr.response], { type: self.options.mimeType });
                    var fileReader = new FileReader();
                    
                    fileReader.onload = function(event){ 
                        var raw = event.target.result;    
                        resolve([raw, xhr.status, xhr]);
                    };
                    
                    fileReader.readAsDataURL(blob);
                    
                } else {
                    var result = parseResponse.bind(self)(xhr);   
                    resolve(result);
                    self.callback(result);    
                }               
                       
                self.options.attempt = 0;
            } else {
                // statusCode >= 400 retry                
                self.timeoutID = setTimeout(function(){
                    self.options.attempt -= 1;
                    console.log('FAIL. ' + xhr.status + ' still more ', self.options.attempt, ' attempts');                        
                    self.do(resolve, reject);
                }, self.options.retryAfter);                
            }
  		}
  };

    xhr.onprogress = wrapProgress(self.options.onProgress);
    xhr.send(self.options.data);  
};

function parseResponse(xhr){
    var parsed;
    var self = this;
    if (window.karma || window.parent.karma){
        // #]*§ WTF!!
        LOG.i('TESTING MODE');
        xhr.responseType = self.options.responseType;
    }                        
    LOG.d('responseType in readyState ', xhr.responseType);                                                                                
    if (xhr.responseType === 'json' || xhr.responseType === 'arraybuffer'){
        LOG.d('JSON CASE!', xhr.response);                        
        parsed = xhr.response;
    } else if (xhr.responseType === 'document'){
        LOG.d('DOCUMENT CASE!', xhr.responseXML);
        parsed = xhr.responseXML;
    } else if (xhr.responseType === 'text' || xhr.responseType === ''){
        LOG.d('TEXT CASE!');                
        parsed = xhr.responseText;
    } else {
        LOG.d('DEFAULT CASE!', xhr.responseText);
        parsed = xhr.responseText;
    }
    
    return [parsed, xhr.status, xhr];
}

function wrapProgress(fn){
     return function(progressEvent){
        if (progressEvent.lengthComputable) {
            var percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            return fn(percentComplete);            
        } else {
            return fn('loading');
        }
    }; 
 }

function addCustomHeaders(headersObj, xhr){
    for (var k in headersObj){
        if (headersObj.hasOwnProperty(k)){
            xhr.setRequestHeader(k, headersObj[k]);           
        }
    }
}

// Static Methods
Http.isXMLHttpRequestSupported = function() {
    return !!window.XMLHttpRequest;
};

Http.isCORSSupported = function() {
    return 'withCredentials' in new XMLHttpRequest;
};

Http.isXDomainSupported = function() {
    return !!window.XDomainRequest;
};

export {
    Http,
    getImageRaw,
    getJSON,
    jsonpRequest
};