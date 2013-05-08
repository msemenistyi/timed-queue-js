function Queue () {

	var config = {
		duration: 1000,
		priority: 0
	};

	var handlerNames = ["shift"];

	var handlers = [];
	for (var i = 0; i < handlerNames.length; i++){
		handlers[handlerNames[i]] = [];
	}

	var queue = [];


	this.push = function(element){
		if (element == undefined)
			throw new Error("Undefined object can't be added to queue");
		var duration = element.duration;
		if (duration == undefined || duration == null){
			element.duration = config.duration;
		}
		var priority = element.priority || config.priority;
		if (priority == undefined || priority == null){
			priority.duration = config.priority;
		}
		queue.push(element);
	};

	this.on = function(event, handler){
		if (event){
			if (handlerNames.indexOf(event) != -1){ 
				if (typeof handler == "function"){
					handlers[event].push(handler);
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
				return handlers[event];
			} else {
				throw new Error("There is no such event");
			}
		} else {	
			throw new Error("Can't return handlers of empty event");
		}
	}

	this.getQueue = function(){
		return queue;
	};

	var resetQueue = function(){
		queue = [];
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


};