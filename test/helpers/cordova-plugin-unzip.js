/**
 * @class
 */
function UnzipOperationClass(fileUrl, dirUrl, cbs, progress){
    var self = this;
    this.progressIntervalID = null;
    this.progressEvent = { loaded: 0, total: 100 };
    this.onprogress = progress;
    this.onsuccess = cbs;
    this.whenFail = -1;
    self.progressIntervalID = setInterval(() => {
        if (self.progressEvent.loaded === 100){
            cbs(0);
            clearInterval(self.progressIntervalID);
            self.progressEvent = { loaded: 0, total: 100 };
        } else if (self.whenFail && self.whenFail === self.progressEvent.loaded) {
            cbs(1);
            clearInterval(self.progressIntervalID);
            self.progressEvent = { loaded: 0, total: 100 };
        } else {
            progress(self.progressEvent);
            self.progressEvent.loaded += 1;
        }
    }, 10);
}

UnzipOperationClass.prototype.fail = function(){
    clearInterval(this.progressIntervalID);
    this.onsuccess(1);    
    this.progressEvent = { loaded: 0, total: 100 };
};

/**
 * @class
 */
function UnzipMock(){
    this.operations = [];
}

UnzipMock.prototype.install = function(){
    var self = this;
    if (!window.zip){
        window.zip = {};
        window.zip.unzip = function(fileUrl, dirUrl, cbs, progress){
            var operation = new UnzipOperationClass(fileUrl, dirUrl, cbs, progress);
            self.operations.push(operation);            
        };
    }
};

UnzipMock.prototype.uninstall = function(){
    if (window.zip){
        delete window.zip;
        this.operations = [];
    }
};

UnzipMock.prototype.getLastOperation = function(){
    return this.operations[this.operations.length - 1];
};

var unzipMock = new UnzipMock();
export default unzipMock;