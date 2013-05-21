var utils;
describe("Utils", function(){
	describe("method isEmpty should", function(){
		beforeEach(function(){
			utils = new Utils;
		});

		it("return true on empty object", function(){
			var object = {};
			expect(utils.isEmpty(object)).toBeTruthy();
		});

		it("return false on non-empty object", function(){
			var object = {a: 1};
			expect(utils.isEmpty(object)).toBeFalsy();
		});

		it("throw expection on non-object passed as an argument", function(){
			var object = 3;
			expect(function(){utils.isEmpty(object)}).toThrow("Method isEmpty applies just objects, not number");
		});
	});

	describe("method copyObject", function(){
		beforeEach(function(){
			utils = new Utils;
		});

		it("should return new object that equals the old one", function(){
			var object = {a: 5, b: 7};
			var newObject = utils.copyObject(object);
			expect(newObject).toEqual(object);
			expect(newObject).not.toBe(object);
		});

		it("should work recursively", function(){
			var nestedObject = {a: 7, b: 9}
			var object = {a: 5, b: 7, c: nestedObject};
			var newObject = utils.copyObject(object);
			expect(newObject).toEqual(object);
			expect(newObject).not.toBe(object);
			expect(newObject.c).toEqual(object.c);
			expect(newObject.c).not.toBe(object.c);
		});

		it("should copy array", function(){
			var array = [4,6,8,9];
			var newArray = utils.copyObject(array);
			expect(newArray).toEqual(array);
			expect(newArray).not.toBe(array);
		});
		
		it("throw expection on non-object passed as an argument", function(){
			var object = 3;
			expect(function(){utils.copyObject(object)}).toThrow("Method copyObject applies just objects, not number");
		});
	});
});