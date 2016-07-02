function simulateEvent(eventName, attrs, time, target){
    var _target;

    if (target && target === "window"){
        _target = window;
    } else {
        _target = document;
    }

    var event = document.createEvent('CustomEvent');
    for(var key in attrs){
        if (!event.hasOwnProperty(key)){
            event[key] = attrs[key];
        }
    }
    event.initEvent(eventName, true, true);
    setTimeout(() => {
        _target.dispatchEvent(event);
    }, time || 1000);
}

export default simulateEvent;