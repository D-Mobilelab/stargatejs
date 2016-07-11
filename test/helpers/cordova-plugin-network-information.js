
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
    window.navigator.connection = {
        type: Connection.WIFI,
        getInfo: (cbs, cbe) => {}
    };
};

NetInfoMock.prototype.uninstall = function(){
    window.navigator.connection = null;
    delete window.Connection;
};

var netInfoMock = new NetInfoMock();
module.exports = netInfoMock;

 /*   <plugin name="cordova-plugin-file" spec="~4.1.0" />
    <plugin name="cordova-plugin-file-transfer" spec="~1.5.0" />
    <plugin name="cordova-plugin-zip" spec="~3.0.0" />
    <plugin name="cordova-plugin-globalization" spec="~1.0.2" />
    <plugin name="cordova-plugin-network-information" spec="~1.2.0" />
    <plugin name="cordova-plugin-settings-hook" spec="~0.2.0" />
    <plugin name="cordova-plugin-crosswalk-webview" spec="^1.7.0" />
    <plugin name="cordova-plugin-statusbar" spec="~2.0.0" />
    <plugin name="cordova-plugin-whitelist" spec="https://github.com/agamemnus/cordova-plugin-whitelist.git" />
    <plugin name="cordova-plugin-network-information" spec="^1.0.1" />
    <plugin name="cordova-plugin-app-version" spec="~0.1.8" />
    <plugin name="cordova-plugin-console" spec="~1.0.2" />
    <plugin name="cordova-plugin-hostedwebapp" spec="https://github.com/D-Mobilelab/OfflineHostedWebApp.git" />
    <plugin name="com.phonegap.plugins.facebookconnect" spec="https://github.com/eatsjobs/phonegap-facebook-plugin.git#ios9">
        <variable name="APP_ID" value="1530616587235761" />
        <variable name="APP_NAME" value="gameasyww" />
    </plugin>
    <plugin name="cc.fovea.cordova.purchase" spec="ssh://git@bitbucket.org/ibridi/cordova-plugin-purchase.git#4.x">
        <variable name="BILLING_KEY" value="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgsZXbOOwc3bES1iJkh3GVZJIYl9MQ8ycMQLG6a0jVwwFLY/Ntr+PS6YrrTSrLjX+SX35nPaALfy8buce3qh1cfcQO5g8ocwyjII1NBVavKjGwXcAJT9AjoD53uATvBfx6LZTjTKc/N4HoKHdNeSWkJIip9ZtP6NIDWcpnBjVZGX/cyDNnI9fF9z75kGQOWprzFeMR5+IyzDcAcEs6xp3e9x3i0U+LtBthatK4wpi3sRMxlUNAz7dE4nEPVdDEpy2VdI9n1FDFGw0X7amLVQ8aqKWj5z84ZoJaA1dSHnWlEkDzXSNJLzktLE5cPErBkTfYh2Ps+0WV2j3bDX4IMbHFwIDAQAB" />
    </plugin>
    <plugin name="com.buongiorno.playme.hybrid.account" spec="ssh://git@bitbucket.org/ibridi/cordova-plugin-account.git#master" />
    <plugin name="com.filfatstudios.spinnerdialog" spec="https://github.com/filfat-Studios-AB/cordova-plugin-spinnerdialog" />
    <plugin name="cordova-plugin-dialogs" spec="~1.2.0" />
    <plugin name="ionic-plugin-keyboard" spec="~1.0.8" />
    <plugin name="cordova-plugin-device" spec="~1.1.1" />
    <plugin name="com.filfatstudios.spinnerdialog" spec="https://github.com/filfat-Studios-AB/cordova-plugin-spinnerdialog" />
    <plugin name="com.appsflyer.phonegap.plugins.appsflyer" spec="ssh://git@github.com/D-Mobilelab/cordova-plugin-appsflyer.git#master" />
    <plugin name="cordova-fabric-plugin" spec="~1.0.6">
        <variable name="FABRIC_API_KEY" value="cf78eef20096545b5edce037192903437ec6012b" />
        <variable name="FABRIC_API_SECRET" value="3ef3d5c3644f32425d60f12ad9b1a693633af3ce3c66a21f25639edbd0152b70" />
    </plugin>
    <plugin name="cordova-plugin-appisdebug" spec="https://github.com/D-Mobilelab/cordova-plugin-appisdebug.git" />
    <plugin name="cordova-plugin-splashscreen" spec="~3.0.0" />*/