var queue;

beforeEach(function(){
	queue = new Queue();
});

describe("Method push should", function(){
	var object = {};

	it("throw exception on attempt not to push undefined element", function(){
		expect(function(){queue.push()}).toThrow("Undefined object can't be added to queue");
	});

	it("not throw exception on attempt to push object", function(){
		expect(function(){queue.push("asd")}).not.toThrow("Undefined object can't be added to queue");
	});

	xit("increase count of events", function(){
		var count = queue.getQueue().length;
		queue.push(object);
		count++;
		expect(count).toBe(queue.getQueue().length);		
	});

	xit("add object to queue", function(){
		var queueArray = queue.getQueue(queue);
		var obj = queueArray.indexOf(object);
		expect(obj).toBe(-1);
		queue.push(object);
		queueArray = queue.getQueue(queue);
		obj = queueArray.indexOf(object);
		expect(obj).not.toBe(-1);
	});
});

describe("Method on should", function(){
	var event = "shift";
	var handler = function(){return true};

	it("throw exception on attempt to subscribe to event that does not exist", function(){
		expect(function(){queue.on("swift");}).toThrow("There is no such event");
	});	

	it("not throw exception on attempt to subscribe to event that exists", function(){
		expect(function(){queue.on(event);}).not.toThrow("There is no such event");
	});	
	
	it("throw exception on attempt to subscribe to empty event", function(){
		expect(function(){queue.on();}).toThrow("Can't subscribe to empty event");
	});		
	
	it("throw exception on attempt not to assign function to event", function(){
		expect(function(){queue.on(event);}).toThrow("Event handler should be a function");
	});
	
	it("throw exception on attempt to assign non function to event", function(){
		expect(function(){queue.on(event, "asd");}).toThrow("Event handler should be a function");
	});
	
	it("increase count of event handlers", function(){
		var count = queue.getHandlers(event).length;
		queue.on(event, handler);
		count++;
		expect(count).toBe(queue.getHandlers(event).length);
	});
	
	it("add handler function to the list of event handlers", function(){
		var handlers = queue.getHandlers(event);
		var fun = handlers.indexOf(handler);
		expect(fun).toBe(-1);
		queue.on(event, handler);
		handlers = queue.getHandlers(event);
		fun = handlers.indexOf(handler);
		expect(fun).not.toBe(-1);
	});
});

describe("Method getHandlers should", function(){
	var event = "shift";
	
	it("throw exception on attempt to get handlers of event that does not exist", function(){
		expect(function(){queue.getHandlers("swift");}).toThrow("There is no such event");
	});	
	
	it("not throw exception on attempt to get handlers of event that exists", function(){
		expect(function(){queue.getHandlers(event);}).not.toThrow("There is no such event");
	});	
	
	it("throw exception on attempt to get handlers of empty event", function(){
		expect(function(){queue.getHandlers();}).toThrow("Can't return handlers of empty event");
	});	

});

describe("Method config should", function(){
	var property = "duration";
	var second_property	 = "priority";
	it("throw exception on attempt to call it without get or set", function(){
		expect(function(){queue.config("asd");}).toThrow("First parameter should be get or set");
		expect(function(){queue.config(0);}).toThrow("First parameter should be get or set");
		expect(function(){queue.config({a:5});}).toThrow("First parameter should be get or set");
		expect(function(){queue.config();}).toThrow("First parameter should be get or set");
	});

	it("not throw exception on attempt to call it with get or set", function(){
		expect(function(){queue.config("get");}).not.toThrow("First parameter should be get or set");
		expect(function(){queue.config("set");}).not.toThrow("First parameter should be get or set");
	});

	it("return config object on call with 'get'", function(){
		var config = queue.config("get");
		expect(typeof config).toBe("object");
		expect(config.hasOwnProperty(property)).toBe(true);
	});	

	it("update mentioned properties with 'set'", function(){
		var config = queue.config("get")
		, propValue = config[property]
		, propValue_second = config[second_property];
		expect(propValue).not.toBe(propertyValue);
		queue.config("set", configObj);
		var config = queue.config("get")
		, propValue = config[property]
		, propValue_second2 = config[second_property];
		expect(propValue_second).toBe(propValue_second2);
	});

	var configObj;
	var propertyValue = 300;
	beforeEach(function(){
		configObj = {};
		configObj[property] = propertyValue;
	});
	it("throw expection when calling 'set' with second parameter that has properties not presented in config object", function(){
		configObj["asd"] = 20; 
		expect(function(){queue.config("set", configObj);}).toThrow();
	});
	
	it("throw expection when calling 'set' with second parameter not represented with object", function(){
		expect(function(){queue.config("set");}).toThrow("Wrong config properties list");
	})
});

describe("Queue should", function(){

	var self = this;

	beforeEach(function(){
		queue = new Queue();
	});
	
	this.fun = function(event){ return "fun_result"; }
	this.fun2 = function(event){ return "fun_result"; }
	it("trigger attached handler on event added to the queue", function(){
		spyOn(self, "fun");
		expect(self.fun.calls.length).toBe(0);
		queue.on("shift", self.fun)
		queue.push("1");
		expect(self.fun.calls.length).toBe(1);
	});	

	it("trigger all attached handlers on event added to the queue", function(){
		spyOn(self, "fun");
		spyOn(self, "fun2");
		expect(self.fun.calls.length).toBe(0);
		expect(self.fun2.calls.length).toBe(0);
		queue.on("shift", self.fun);
		queue.on("shift", self.fun2);
		queue.push("1");
		expect(self.fun.calls.length).toBe(1);
		expect(self.fun2.calls.length).toBe(1);
	});	

	var duration = 300;
	var options = {
			duration: duration
		};

	it("trigger handlers to be called for all events in the queue", function(){
		spyOn(self, "fun");
		expect(self.fun.calls.length).toBe(0);
		jasmine.Clock.useMock();
		queue.on("shift", self.fun);
		queue.push("1", options);
		jasmine.Clock.tick(300);
		queue.push("2");
		expect(self.fun.calls.length).toBe(2);
	});

	it("trigger handlers to be called in time", function(){
		spyOn(self, "fun");
		expect(self.fun.calls.length).toBe(0);
		jasmine.Clock.useMock();
		queue.on("shift", self.fun);
		queue.push("1", options);
		jasmine.Clock.tick(299);
		queue.push("2");
		expect(self.fun.calls.length).toBe(1);
		jasmine.Clock.tick(1);
		expect(self.fun.calls.length).toBe(2);
	});
});