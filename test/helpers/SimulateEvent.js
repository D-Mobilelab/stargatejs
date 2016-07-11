function simulateEvent(eventName, attrs, time, target){
    var _target;

    if (target && target === 'window'){
        _target = window;
    } else {
        _target = document;
    }

    // var event = document.createEvent('CustomEvent');
    var event = new CustomEvent(eventName, { detail: Date.now() });
    /* for(var key in attrs){
        if (!event.hasOwnProperty(key)){
            event[key] = attrs[key];
        }
    }*/
    
    _target.dispatchEvent(event);
    setTimeout(() => {
        _target.dispatchEvent(event);
    }, time || 1000);
}

module.exports = simulateEvent;