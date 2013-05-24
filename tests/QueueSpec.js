var queue;
describe("Queue ", function(){
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

		xit("increase count of objects in queue", function(){
			var count = queue.getQueue().length;
			expect(count).toBe(0);		
			var options = {
				duration: 300
			};
			queue.push(object);
			count = queue.getQueue().length;
			expect(count).toBe(1);		
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
			var success = false;
			for (var i = 0; i < handlers.length; i++ ){
				if (handlers[i].fun == handler){
					success = true;
					break;
				}
			}
			expect(success).toBeFalsy();
			queue.on(event, handler);
			success = false;
			handlers = queue.getHandlers(event);
			for (var i = 0; i < handlers.length; i++ ){
				if (handlers[i].fun == handler){
					success = true;
					break;
				}
			}
			expect(success).toBeTruthy();
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

	describe("Queue should trigger", function(){

		var self = this;

		beforeEach(function(){
			queue = new Queue();
		});
		
		this.fun = function(event){ console.log("a"); return "fun_result"; }
		this.fun2 = function(event){ console.log("b"); return "fun_result"; }
		it("attached handler on event added to the queue", function(){
			spyOn(self, "fun");
			expect(self.fun.calls.length).toBe(0);
			queue.on("shift", self.fun)
			queue.push("1");
			expect(self.fun.calls.length).toBe(1);
		});	

		it("all attached handlers on event added to the queue", function(){
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

		it("handlers to be called for all events in the queue", function(){
			spyOn(self, "fun");
			expect(self.fun.calls.length).toBe(0);
			jasmine.Clock.useMock();
			queue.on("shift", self.fun);
			queue.push("1", options);
			jasmine.Clock.tick(300)
			queue.push("2");
			expect(self.fun.calls.length).toBe(2);
		});

		it("handlers to be called right in time (not earlier)", function(){
			spyOn(self, "fun");
			expect(self.fun.calls.length).toBe(0);
			jasmine.Clock.useMock();
			queue.on("shift", self.fun);
			queue.push("1", options);
			jasmine.Clock.tick(299);
			queue.push("2");
			expect(self.fun.calls.length).toBe(1);
			jasmine.Clock.tick(200);
			expect(self.fun.calls.length).toBe(2);
		});

		it("handlers exactly predefined number of times", function(){
			var hand1 = {
				handler: self.fun,
				calls: 2
			};
			var hand2 = {
				handler: self.fun2
			};
			spyOn(hand1, "handler");
			spyOn(hand2, "handler");
			expect(hand1.handler.calls.length).toBe(0);
			expect(hand2.handler.calls.length).toBe(0);
			queue.on("shift", hand1);
			queue.on("shift", hand2);
			queue.push("1");
			expect(hand1.handler.calls.length).toBe(1);
			expect(hand2.handler.calls.length).toBe(1);
			queue.push("2");
			expect(hand1.handler.calls.length).toBe(2);
			expect(hand2.handler.calls.length).toBe(2);
			queue.push("3");
			expect(hand1.handler.calls.length).toBe(2);
			expect(hand2.handler.calls.length).toBe(3);
		});


		it("handlers by predefined priorities", function(){
			self.fun = function(){
				this.a += "1";
			};
			self.fun2 = function(){
				this.a += "2";
			};
			this.a = "0";
			var hand1 = {
				handler: self.fun,
				priority: 1,
				context: this
			};
			var hand2 = {
				handler: self.fun2,
				priority: 0,
				context: this
			};
			queue.on("shift", hand1);
			queue.on("shift", hand2);
			queue.push("1");
			expect(this.a).toBe("021");
		});

		it("handlers in predefined context", function(){
			this.a = null;
			self.fun = function(){
				this.a = 5;
			};
			var hand1 = {
				handler: self.fun,
				context: this
			};
			queue.on("shift", hand1);
			queue.push(hand1);
			expect(this.a).toBe(5);
		});
	});

	describe("Custom states should", function(){
		
		it("add state represented with string", function(){
			var customStates = queue.getStates().custom;
			expect(customStates["animating"]).toBeUndefined();
			queue.addStates("animating");
			var customStates = queue.getStates().custom;
			expect(customStates["animating"]).toBeDefined();
		});

		it("add states represented with array", function(){
			var customStates = queue.getStates().custom;
			expect(customStates["querying"]).toBeUndefined();
			expect(customStates["animating"]).toBeUndefined();
			queue.addStates(["querying", "animating"]);
			var customStates = queue.getStates().custom;
			expect(customStates["querying"]).toBeDefined();
			expect(customStates["animating"]).toBeDefined();
		});

		it("be added by passing as a second arg to Queue constructor", function(){
			var config = {};
			var states = ["querying", "animating"];
			queue = new Queue(config, states);
			var customStates = queue.getStates().custom;
			expect(customStates["querying"]).toBeDefined();
			expect(customStates["animating"]).toBeDefined();
		});

		it("throw an exception on attempt to pass wrong argument types", function(){
			var state = 5;
			expect(function(){ queue.addStates(state)}).toThrow("Wrong states type. Custom states should be presented with either string or array containing strings.");
		});

		var state = "asd";
		it("throw an expection on attempt to update state that doesn't exist", function(){
			expect(function(){ queue.updateStates(state); }).toThrow(state + " state is undefined");

		});

		it("be updated be passing string", function(){
			queue.addStates(state);
			var condition = queue.getStates().custom[state];
			expect(condition).toBeFalsy();
			queue.updateStates(state);
			var condition = queue.getStates().custom[state];
			expect(condition).toBeTruthy();
		});

		var states = ["active", "querying", "animating"];
		it("be updated by passing array", function(){
			queue.addStates(states);
			var currentStates = queue.getStates().custom;
			expect(currentStates[states[0]]).toBeFalsy();
			expect(currentStates[states[1]]).toBeFalsy();
			expect(currentStates[states[2]]).toBeFalsy();
			queue.updateStates(states);
			var currentStates = queue.getStates().custom;
			expect(currentStates[states[0]]).toBeTruthy();
			expect(currentStates[states[1]]).toBeTruthy();
			expect(currentStates[states[2]]).toBeTruthy();
		});

		var statesToBeUpdated = {
			active: true,
			querying: false,
			animating: true
		};
		it("be updated by passing key:value pairs", function(){
			queue.addStates(states);
			var currentStates = queue.getStates().custom;
			expect(currentStates["active"]).toBeFalsy();
			expect(currentStates["querying"]).toBeFalsy();
			expect(currentStates["animating"]).toBeFalsy();
			queue.updateStates(statesToBeUpdated);
			var currentStates = queue.getStates().custom;
			expect(currentStates["active"]).toBeTruthy();
			expect(currentStates["querying"]).toBeFalsy();
			expect(currentStates["animating"]).toBeTruthy();
		});

		it("throw an exception on attempt to pass wrong key", function(){
			queue.addStates(states);
			var currentStates = queue.getStates().custom;
			expect(currentStates["waiting"]).toBeUndefined();
			statesToBeUpdated["waiting"] = true;
			expect(function(){ queue.updateStates(statesToBeUpdated); }).toThrow("waiting state is undefined");
		});

		it("throw an exception on attempt to pass number as an argument to updateStates", function(){
			var state = 5;
			expect(function(){ queue.updateStates()}).toThrow("Wrong arg type. updatesStates method takes either string, array or string:boolean pairs");
		});
	});
});