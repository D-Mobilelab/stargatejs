
function FilePluginMock(conf){
    this.appID = conf.appID;
}

FilePluginMock.prototype.install = function(){
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
    
    if (window.cordova){
        window.cordova.file = {
            "applicationDirectory":"file:///android_asset/",
            "applicationStorageDirectory":"file:///data/data/" + this.appID + "/",
            "dataDirectory":"file:///data/data/" + this.appID + "/files/",
            "cacheDirectory":"file:///data/data/com.buongiorno.gameasy.ww/cache/",
            "externalApplicationStorageDirectory":"file:///storage/emulated/0/Android/data/" + this.appID + "/",
            "externalDataDirectory":"file:///storage/emulated/0/Android/data/" + this.appID + "/files/",
            "externalCacheDirectory":"file:///storage/emulated/0/Android/data/" + this.appID + "/cache/",
            "externalRootDirectory":"file:///storage/emulated/0/",
            "tempDirectory":null,
            "syncedDataDirectory":null,
            "documentsDirectory":null,
            "sharedDirectory":null
        };
    }
    
};

FilePluginMock.prototype.uninstall = function(){
    if (window.cordova.file){
        delete window.cordova.file;
    }
};

var filePluginMock = new FilePluginMock({ appID: 'com.company.appname' });

export default filePluginMock;