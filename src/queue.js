function Queue () {

	var config = {
		duration: 1000,
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
		running: false
	};

	this.push = function(element, options){
		if (element == undefined)
			throw new Error("Undefined object can't be added to queue");
		var options = optionsResolver(options);
		queue.push({element: element, options: options});
		processQueue();
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

	this.getStates = function(){
		return states;
	}

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

	var processQueue = function(){
		if (queue.length != 0 && !states.running){
			updateQueueDueToPriorities();
			var item = queue.shift();
			states.running = true;
			triggerHandlers("shift", item.element);
			setTimeout(processQueue, item.options.duration);
		} else {
			states.running = false;
		}
	};

	var triggerHandlers = function(event, item){
		if (handlerNames.indexOf(event) != -1 ){
			for (var i = 0; i < handlers[event].length; i++){
				handlers[event][i](item);
			}
		} else {
			throw new Error("There is no such event");
		}
	}

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
				return i.priority < j.priority ? 1 : (i.priority == j.priority ? 0 : -1);
			});
		}
	};
};