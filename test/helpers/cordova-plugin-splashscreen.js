function SplashScreenMock(){

}

SplashScreenMock.prototype.install = function(){
    window.splashscreen = {
        hide: function(){
            return true;
        },
        show: function(){
            return true;
        }
    };
};

SplashScreenMock.prototype.uninstall = function(){
    delete window.splashscreen;
};

var splashScreenInstance = new SplashScreenMock();
export default splashScreenInstance;