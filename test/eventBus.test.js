import eventBus from '../src/modules/EventBus';

fdescribe('EventBus tests', () => {    
    
    beforeEach(() => {
        
    });

    afterEach(() => {
        eventBus.events = {};
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
        expect(eventBus.events.connectionchange.length).toEqual(1);
        expect(callbacks.callback).toHaveBeenCalled();
        expect(callbacks.callback).toHaveBeenCalledWith('param1', [], {});
        
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
        expect(callbacks.callback).toHaveBeenCalledWith('param1', [], {});
        
        // Remove a callback
        eventBus.off('connectionchange', callbacks.callback);

        // Should not trigger
        eventBus.trigger('connectionchange', 'param1', [], {});        
        expect(eventBus.events.connectionchange).toBeDefined();
        expect(eventBus.events.connectionchange.length).toEqual(0);
        expect(callbacks.callback).not.toHaveBeenCalled();
        
    });
    
});