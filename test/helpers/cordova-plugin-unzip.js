function UnzipMock(){
    this.progressIntervalID = null;
    this.progressEvent = { loaded: 0, total: 100 };
}

UnzipMock.prototype.failAt = function(at){
    this.whenFail = at;
};

UnzipMock.prototype.install = function(){
    var self = this;
    if (!window.zip){
        window.zip = {};
        window.zip.unzip = function(fileUrl, dirUrl, cbs, progress){

            self.progressIntervalID = setInterval(function(){
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
    }
};

UnzipMock.prototype.uninstall = function(){
    if (window.zip){
        clearInterval(this.progressIntervalID);
        delete window.zip;
    }
};

export {UnzipMock};