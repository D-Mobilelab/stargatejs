/**
 * @class
 * @alias module:src/modules/EventBus
 * */
function EventBus(){
	this.events = {};
}

/**
 * on function
 * @param {String} eventType - if not exists it defines a new one
 * @param {Function} func - the function to call when the event is triggered
 */
EventBus.prototype.on = function(eventType, func, context = null){
	if (!this.events[eventType]){ this.events[eventType] = []; }
	this.events[eventType].push({ func: func, context: context });
};

/**
 * trigger function
 * @param {String} eventType - the eventType to trigger. if not exists nothing happens 
 */
EventBus.prototype.trigger = function(eventType){
	if (!this.events[eventType] || this.events[eventType] < 1){ return; }
	var args = [].slice.call(arguments, 1);
	this.events[eventType].map((obj) => {
		obj.func.apply(obj.context, args);
	});
};

/**
 * remove function
 * @param {String} eventType - the eventType
 * @param {Function} func - the reference of the function to remove from the list of function
 */
EventBus.prototype.off = function(eventType, func){
	if (!this.events[eventType]){ return; }

	for(var i = this.events[eventType].length - 1; i >= 0; i--){
		if(this.events[eventType][i].func === func){
			this.events[eventType].splice(i, 1);
		}
	}
};

// Export as a singleton
var eventBusIstance = new EventBus;
export default eventBusIstance;