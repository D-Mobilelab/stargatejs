
var Connection = {
    UNKNOWN: 'unknown',
    ETHERNET: 'ethernet',
    WIFI: 'wifi',
    CELL_2G: '2g',
    CELL_3G: '3g',
    CELL_4G: '4g',
    CELL: 'cellular',
    NONE: 'none'
};

function NetInfoMock(){}

NetInfoMock.prototype.install = function(){
    window.Connection = Connection;
    if (!window.navigator.connection){
        window.navigator.connection = {
            type: Connection.WIFI,
            getInfo: (cbs, cbe) => {}
        };
    }
};

NetInfoMock.prototype.uninstall = function(){
    if (window.navigator.connection){
        window.navigator.connection = null;    
    }
    delete window.Connection;
};

var netInfoMock = new NetInfoMock();
module.exports = netInfoMock;