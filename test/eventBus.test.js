var EventBus = require('../src/modules/EventBus');

describe('EventBus tests', () => {    
    var eventBus;
    beforeEach(() => {
        eventBus = new EventBus();
    });

    afterEach(() => {
        eventBus = null;
    });
    
    it('EventBus should trigger with custom data', () => {
        var callbacks = {
            callback: (data) => {
                console.log('Data received!', data);
            }
        };
        
         
        spyOn(callbacks, 'callback');
        eventBus.on('connectionchange', callbacks.callback);
        
        eventBus.trigger('connectionchange', 'param1', [], {});
        
        expect(eventBus.events.connectionchange).toBeDefined();        
        expect(callbacks.callback).toHaveBeenCalled();
        expect(callbacks.callback).toHaveBeenCalledWith('param1', [], {});
        expect(callbacks.callback).toHaveBeenCalledTimes(1);
        
    });

    it('EventBus should not trigger if i remove it', () => {
        var callbacks = {
            callback: (data) => {
                console.log('Data received!', data);
            }
        };
        
         
        spyOn(callbacks, 'callback');
        
        // Add a callback
        eventBus.on('connectionchange', callbacks.callback);        
        
        // Remove a callback
        eventBus.off('connectionchange', callbacks.callback);

        // Should not trigger
        eventBus.trigger('connectionchange', 'param1', [], {});        
        expect(eventBus.events.connectionchange).toBeDefined();
        expect(eventBus.events.connectionchange.length).toEqual(0);
        expect(callbacks.callback).not.toHaveBeenCalled();
        
    });
    
});