var EventBus = require("../src/modules/EventBus");

describe("EventBus tests",function(){
    
    var eventBus = null;
    beforeEach(function(){
        eventBus = new EventBus();
    });
    
    it("EvenBus should trigger with custom data", function(){
        var callbacks = {
            callback:function(data){
                console.log("Data received!", data);
            }
        }
        
         
        spyOn(callbacks, "callback");
        eventBus.on("connectionchange", callbacks.callback);
        
        eventBus.trigger("connectionchange", {some:"data"});
        
        expect(eventBus.events.connectionchange).toBeDefined()
        expect(eventBus.events.connectionchange.length).toEqual(1);
        expect(callbacks.callback).toHaveBeenCalled();
        expect(callbacks.callback).toHaveBeenCalledWith({some:"data"});
        
    });
    
});