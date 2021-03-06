function Queue (customConfig, customStates) {

	var config = {
		duration: 0,
		priority: 0,
		higherPrioritiesReseting: true
	};

	var handlerNames = ["shift"];

	var handlers = [];
	for (var i = 0; i < handlerNames.length; i++){
		handlers[handlerNames[i]] = [];
	}

	var queue = [];

	var states = {
		running: false,
		waiting: false,
		custom: {}
	};

	this.utils = new Utils;

	this.addStates = function(statesToBeAdded){
		if (statesToBeAdded instanceof Array){
			for (var i = 0; i < statesToBeAdded.length; i++) if (typeof statesToBeAdded[i] === "string"){
				states.custom[statesToBeAdded[i]] = false;
			} else {
				throw new Error("Wrong state type. Custom states should be presented with string defining their names.");
			}
		} else if (typeof statesToBeAdded === "string") {
			states.custom[statesToBeAdded] = false;	
		} else if (typeof statesToBeAdded !== "undefined") {
			throw new Error("Wrong states type. Custom states should be presented with either string or array containing strings.");
		}
	};

	this.addStates(customStates);

	this.updateStates = function(statesObject){
		var type = typeof statesObject;
		if (type === "object"){
			if (statesObject instanceof Array){
				for (var i = 0; i < statesObject.length; i++){
					if (typeof states.custom[statesObject[i]] !== "undefined"){
						states.custom[statesObject[i]] = true;
					}
				}
			} else {
				for (var i in statesObject){
					if (typeof states.custom[i] !== "undefined"){
						if (typeof statesObject[i] === "boolean"){
							states.custom[i] = statesObject[i];
						} else {
							throw new Error("Value should be boolean");
						}
					} else {
						throw new Error(i + " state is undefined");
					}
				}
			}
		} else if (type === "string"){
			if (typeof states.custom[statesObject] !== "undefined"){
				states.custom[statesObject] = true;
			} else {
				throw new Error(statesObject + " state is undefined");
			}
		} else {
			throw new Error("Wrong arg type. updatesStates method takes either string, array or string:boolean pairs");
		}
	};

	this.config = function(action, object){
		if (action == "get"){
			return config;
		} else if (action == "set"){
			if (typeof object == "object"){
				for (var prop in object){
					if (config[prop] != undefined && config[prop] != null){
						config[prop] = object[prop];
					}
					else{
						throw new Error("Property " + prop + " is not in object");
					}
				}
			} else {
				throw new Error("Wrong config properties list");
			}
		} else {
			throw new Error("First parameter should be get or set")
		}
	};

	if (typeof customConfig === "object")
		this.config("set", customConfig);

	this.push = function(element, options){
		if (element == undefined)
			throw new Error("Undefined object can't be added to queue");
		var options = optionsResolver(options);
		queue.push({element: element, options: options});
		processQueue();
	};

	this.on = function(event, handlerOptions){
		if (event){
			if (handlerNames.indexOf(event) != -1){ 
				if (typeof handlerOptions == "function"){
					handlers[event].push({fun: handlerOptions});
				} else if (typeof handlerOptions == "object"){
					if (typeof handlerOptions.handler == "function"){
						var handler = {};
						handler.fun = handlerOptions.handler;
						
						if (typeof handlerOptions.context === "object"){
							handler.context = handlerOptions.context;
						} else if (typeof context !== "undefined"){
							throw new Error("Context for handler should be a function");
						}

						if (typeof handlerOptions.priority != "undefined"){
							if (typeof handlerOptions.priority == "number"){
								handler.priority = parseInt(handlerOptions.priority);
							} else {
								throw new Error("Event handler priority should be a number");
							}
						}
						
						if (typeof handlerOptions.calls != "undefined"){
							if (typeof handlerOptions.calls == "number"){
								handler.calls = parseInt(handlerOptions.calls);
							} else {
								throw new Error("Event handler calls should be a number");
							}
						}
						handlers[event].push(handler);
					} else {
						throw new Error("Event handler should be a function");
					}
				} else {
					throw new Error("Event handler should be a function");
				} 
			} else{
				throw new Error("There is no such event");
			}
		} else {
			throw new Error("Can't subscribe to empty event");
		}
	};

	this.getHandlers = function(event){
		if (event){
			if (handlerNames.indexOf(event) != -1){
				var handlersToBeReturned = this.utils.copyObject(handlers[event]);
				return handlersToBeReturned;
			} else {
				throw new Error("There is no such event");
			}
		} else {	
			throw new Error("Can't return handlers of empty event");
		}
	}

	this.getQueue = function(){
		var queueToBeReturned = this.utils.copyObject(queue);
		return queueToBeReturned;
	};

	this.getStates = function(){
		var statesToBeReturned = this.utils.copyObject(states);
		return statesToBeReturned;
	}

	var resetQueue = function(){
		queue = [];
	};

	var processQueue = function(){
		if (queue.length != 0){
			if (states.running === false){
				states.waiting = false;
				if (checkStates() === true){
					updateQueueDueToPriorities();
					var item = queue.shift();
					states.running = true;
					triggerHandlers("shift", item.element);
					if (item.options.duration != 0){
						setTimeout(processQueue, item.options.duration);
						states.waiting = true;
					} else{
						processQueue();
					}
				}
			}
		} else {
			states.running = false;
		}
	};

	var triggerHandlers = function(event, item){
		if (handlerNames.indexOf(event) != -1 ){
			handlers[event].sort(function(i, j){
				return i.priority > j.priority ? 1 : (i.priority == j.priority ? 0 : -1);
			});
			var y = handlers[event].length;
			for (var i = 0; i < y; i++){
				if (typeof handlers[event][i].calls != "undefined"){
					if (handlers[event][i].calls > 0){
						if (typeof handlers[event][i].context !== "undefined"){
							handlers[event][i].fun.call(handlers[event][i].context, item);
						} else {
							handlers[event][i].fun(item);
						}
						handlers[event][i].calls--;
						if (handlers[event][i].calls == 0){
							handlers[event].splice(i,1);
							y--;
							i--;
						}
					}
				} else {
					if (typeof handlers[event][i].context !== "undefined"){
						handlers[event][i].fun.call(handlers[event][i].context, item);
					} else {
						handlers[event][i].fun(item);
					}
				}
			}
		} else {
			throw new Error("There is no such event");
		}
	}

	var checkStates = function(){
		for (var i in states.custom){
			if (states.custom[i] === true){
				return false;
			}
		}
		return true;
	};

	var optionsResolver = function(options){
		if (options == undefined){
			var options = {};
			options.duration = config.duration;
			options.priority = config.priority;
		} else {
			if (options.duration != undefined){
				options.duration = parseInt(options.duration);
			} else {
				options.duration = config.duration;
			}	

			if (options.priority != undefined){
				options.priority = parseInt(options.priority);
			} else {
				options.priority = config.priority;
			}	
		}
		return options;
	}

	var updateQueueDueToPriorities = function(){
		if (config.higherPrioritiesReseting == true){
			for (var i = 1; i < queue.length; i++) if (queue[i].priority < queue[0].priority){
					queue.splice(i,1);
			}
		} else {
			queue.sort(function(i,j){
				return i.priority > j.priority ? 1 : (i.priority == j.priority ? 0 : -1);
			});
		}
	};
};