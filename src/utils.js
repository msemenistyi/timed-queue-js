function Utils(){

}

Utils.prototype.isEmpty = function(object) {
	var type = typeof object;
	if ( type=== "object"){
		for (var i in object) if (object.hasOwnProperty(i)){
			return false;
		}
		return true;
	} else {
		throw new Error("Method isEmpty applies just objects, not " + type);
	}
};

Utils.prototype.copyObject = function(object) {
	var type = typeof object;
	if (type === "object"){
		var newObject;
		if (object instanceof Array){
			newObject = [];
			for (var i = 0; i < object.length; i++){
				newObject[i] = object[i];
			}
		} else {
			newObject = {};
			for (var i in object) if (object.hasOwnProperty(i)){
				if (typeof object[i] !== "object"){
					newObject[i] = object[i];
				} else {
					newObject[i] = this.copyObject(object[i]);
				}
			}
		}
		return newObject;
	} else {
		throw new Error("Method copyObject applies just objects, not " + type);
	}
};