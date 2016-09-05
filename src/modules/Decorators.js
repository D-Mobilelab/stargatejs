/**
 * Decorator function: 
 * @param {Boolean|Function} param - the require param or function. the function should return a boolean 
 * @param {Function} afterFunction - the function to decorate
 * @param {Object} [context=null] - the optional this-context. default to null
 * @param {String} message - the message to show
 * @param {String} type - error raise an error, warn, info, debug write the message in console
 * @param {Logger} logger - an istance of logger class
 * @throws {Error}
 * @returns {Function} 
 */
function requireCondition(param, afterFunction, context = null, message, type, logger){ 
	return function decorator(){
		let _param;
        
		if (typeof param === 'function'){
            _param = param.call(null);
        } else if(typeof param === 'boolean') {
			_param = param ? true : false;
		}
		
		if (_param){
			return afterFunction.apply(context, arguments); 
		} else {
			switch (type){
				case "error":
					throw new Error(message);
					break;
				case "warn":
					logger.warn(message);
					break;
				case "info":
					logger.info(message);
					break;
				default:
					logger.log(message);
					break;
			}			
		}
	};
}

export { requireCondition };