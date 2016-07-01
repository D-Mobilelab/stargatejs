var connection = require("../src/modules/Connection");
var SimulateEvent = require("./helpers/helpers").SimulateEvent;
var mockCordovaConnection = require("./helpers/helpers").mockCordovaConnection;
var unmockCordovaConnection = require("./helpers/helpers").unmockCordovaConnection;

describe("Utils tests", function(){    
    
    beforeEach(function() {
    
    });

    afterEach(function() {
    
    });
    
    it("Test ConnectionChange offline if it's a browser", function(done){
        connection.initialize();
        
        var onchange = jasmine.createSpy("connchange");
        connection.addListener("connectionchange", onchange);
        
        SimulateEvent("offline", {type:"offline"}, 1, "document");
        
        setTimeout(function(){
            expect(onchange).toHaveBeenCalledWith({type:"none",networkState:"offline"});;
            done();
        },600);
    });
    
    it("Test Connection online if it's a browser", function(done){
        connection.initialize();
        
        var onchange = jasmine.createSpy("connchange");
        connection.addListener("connectionchange", onchange);
        
        SimulateEvent("online", {type:"online"}, 1, "document");
        
        setTimeout(function(){
            expect(onchange).toHaveBeenCalledWith({type:"none",networkState:"online"});;
            done();
        },600);
    });
    
   it("Test Connection online if cordova-network-information is defined", function(done){
        mockCordovaConnection();
        connection.initialize();
        
        var onchange = jasmine.createSpy("connchange");
        connection.addListener("connectionchange", onchange);
        
        SimulateEvent("online", {type:"online"}, 1, "document");
        
        setTimeout(function(){
            expect(onchange).toHaveBeenCalledWith({type:"wifi",networkState:"online"});;
            unmockCordovaConnection();
            done();
        },600);
    });
    
    it("Test Connection offline if it's cordova-network-information defined", function(done){
        mockCordovaConnection();
        connection.initialize();
        
        var onchange = jasmine.createSpy("connchange");
        connection.addListener("connectionchange", onchange);
        
        //mock it
        window.navigator.connection.type = "wifi";
        
        // Simulate Event
        SimulateEvent("offline", {type:"offline"}, 1, "document");
        
        setTimeout(function(){
            expect(onchange).toHaveBeenCalledWith({type:"wifi",networkState:"offline"});            
            done();
            unmockCordovaConnection();
        }, 600);
    });
});