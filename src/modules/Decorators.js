/**
 * Decorator function: 
 * @private
 * @param {Boolean|Function} param - the require param or function. the function should return a boolean 
 * @param {Function} afterFunction - the function to decorate
 * @param {Object} [context=null] - the optional this-context. default to null
 * @param {String} message - the message to show
 * @param {String} type - error raise an error, warn, info, debug write the message in console
 * @throws {Error}
 * @returns {Function} 
 */
function requireCondition(param, afterFunction, context = null, message, type){ 
	return function(){
        if (typeof param === 'function'){
            param = param.call(null);
        }
		if (param){
			return afterFunction.apply(context, arguments); 
		} else {
			switch (type){
				case "error":
					throw new Error(message);
					break;
				case "warn":
					console.warn(message);
					break;
				case "info":
					console.info(message);
					break;
				default:
					console.log(message);
					break;
			}			
		}
	};
}


export { requireCondition };