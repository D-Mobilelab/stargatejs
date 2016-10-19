/**
 * @class
 * @alias module:src/modules/EventBus
 * */
class EventBus {
	constructor(){
		this.events = {};
	}

	/**
	 * on function
	 * @param {String} eventType - if not exists it defines a new one
	 * @param {Function} func - the function to call when the event is triggered
	 * @param {Object} [context=null] - the 'this' applied to the function. default null
	 */
	on(eventType, func, context = null){
		if (!this.events[eventType]){ this.events[eventType] = []; }
		this.events[eventType].push({ func: func, context: context });
	}

	/**
	 * trigger function
	 * @param {String} eventType - the eventType to trigger. if not exists nothing happens 
	 */
	trigger(eventType){
		if (!this.events[eventType] || this.events[eventType].length === 0){ return; }
		var args = [].slice.call(arguments, 1);
		this.events[eventType].map((obj) => {
			obj.func.apply(obj.context, args);
		});
	}

	/**
	 * off function
	 * @param {String} eventType - the eventType
	 * @param {Function} func - the reference of the function to remove from the list of function
	 */
	off(eventType, func){
		if (!this.events[eventType]){ return; }

		let newState = this.events[eventType].reduceRight((prev, current, index, arr) => {
			if(current.func !== func){
				prev.push(current);
			} 
			return prev;
		}, []);

		this.events[eventType] = newState;		
	}

	/**
	 * clear all the functions associated at the specific eventType
	 * if the event not exists nothing happens
	 * @param {String} eventType 
	 */
	clear(eventType){
		if (!this.events[eventType]){ return; }
		this.events[eventType] = [];
	}
}

module.exports = EventBus;