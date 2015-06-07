/* 
	Rectangle Class
	Requires window.Coords class object from Coords.js
	By Luke Nickerson, 2015
	Vertex indices are 0,1,2,3 from the top left, clockwise
*/

var Rectangle = function(x1, y1, x2, y2, vertexNames)
{
	x1 = (typeof x1 === 'undefined') ? 0 : x1;
	y1 = (typeof y1 === 'undefined') ? 0 : y1;
	x2 = (typeof x2 === 'undefined') ? 50 : x2;
	y2 = (typeof y2 === 'undefined') ? 50 : y2;
	if (typeof vertexNames === 'undefined') {
		vertexNames = ["A", "B", "C", "D"];
	}
	this.vertexNames 	= vertexNames;
	// Set coordinates and adjust
	this.topLeft 		= new Coords(x1, y1);
	this.bottomRight 	= new Coords(x2, y2);
	this.adjust();
	
	// Construct Vertex Coordinate Getter/Setters
	this.vertex			= [];
	(function(o){
		var constructVertexGetterSetter = function(v){
			o.vertex[v] = {
				"x" : function(val){ return o.vertexGetterSetter(v, "x", val); }
				,"y" : function(val){ return o.vertexGetterSetter(v, "y", val); }
			};
		}
		for (var v = 0; v < 4; v++) {
			constructVertexGetterSetter(v);
		}
	})(this);
}
//==== Dual Getter/Setter function
Rectangle.prototype.vertexGetterSetter = function(v, xy, val) {
	if (typeof val === 'undefined') { 	// Get
		return this.getVertex(v)[xy];
	} else {							// Set
		// Get current coordinates of this vertex
		var vertex = this.getVertex(v);
		var coords = new Coords(vertex.x, vertex.y);
		// Then overwrite one of the values
		coords[xy] = val;
		return this.setVertex(v, coords);
	}
}
//==== Setters
Rectangle.prototype.set = function(topLeftCoords, bottomRightCoords, adjust){
	this.topLeft.set(topLeftCoords);
	this.bottomRight.set(bottomRightCoords);
	// Adjust the coordinates by default
	if (typeof adjust !== 'boolean') { adjust = true; }
	if (adjust) {
		this.adjust();
	}	
	return this;
}
Rectangle.prototype.setVertex = function(v, coords, adjust){
	switch (v) {
		case 0: 
			this.topLeft.set(coords);
			break;
		case 1:
			this.bottomRight.x = coords.x;
			this.topLeft.y = coords.y;
			break;
		case 2: 
			this.bottomRight.set(coords);
			break;
		case 3:
			this.topLeft.x = coords.x;
			this.bottomRight.y = coords.y;
			break;
		default: 
			console.error("Invalid vertex index: ", v);
			break;
	}
	if (typeof adjust !== 'boolean') { adjust = true; }
	if (adjust) {
		this.adjust();
	}	
	return this;
}

//==== Getters
// Get the vertex coordinates (by value as a Coord, not by reference)
Rectangle.prototype.getVertex = function(v){
	switch (v) {
		case 0: 
			//return this.topLeft;
			return new Coords(this.topLeft.x, this.topLeft.y);
			break;
		case 1:
			return new Coords(this.bottomRight.x, this.topLeft.y);
			break;
		case 2: 
			//return this.bottomRight;
			return new Coords(this.bottomRight.x, this.bottomRight.y);
			break;
		case 3:
			return new Coords(this.topLeft.x, this.bottomRight.y);
			break;
		default: 
			console.error("Invalid vertex index: ", v);
			break;
	}
	return null;
}
Rectangle.prototype.getLength = function(){
	return Math.abs(this.topLeft.x - this.bottomRight.x);
}
Rectangle.prototype.getWidth = function(){
	return Math.abs(this.topLeft.y - this.bottomRight.y);
}
Rectangle.prototype.getArea = function(){
	return this.getWidth() * this.getLength();
}
Rectangle.prototype.getPerimeter = function(){
	return ((2 * this.getWidth()) + (2 * this.getLength()));
}
Rectangle.prototype.getDiagonal = function(){
	return this.topLeft.getDistance( this.bottomRight );
}

//==== Adjust coordinates
Rectangle.prototype.adjust = function(){
	var ogTopLeft = new Coords(this.topLeft.x, this.topLeft.y);
	var ogBottomRight = new Coords(this.bottomRight.x, this.bottomRight.y);
	this.topLeft.set( new Coords(
		Math.min(ogTopLeft.x, ogBottomRight.x)
		,Math.min(ogTopLeft.y, ogBottomRight.y)
	) );
	this.bottomRight.set( new Coords(
		Math.max(ogTopLeft.x, ogBottomRight.x)
		,Math.max(ogTopLeft.y, ogBottomRight.y)
	) );
	//console.log("Original", ogTopLeft, ogBottomRight, "\nNew", this.topLeft, this.bottomRight);
}

//==== Functions for determining containment, intersections, and adjacency
Rectangle.prototype._isCoordContained = function(xy, coord){
	var low = Math.min(this.topLeft[xy], this.bottomRight[xy]);
	var high = Math.max(this.topLeft[xy], this.bottomRight[xy]);
	//console.log("_isCoordContained", xy, coord[xy], "low = ", low, "high = ", high);
	return (coord[xy] >= low && coord[xy] <= high) ? true : false;
}
Rectangle.prototype.isCoordContained = function(coord){
	return ( 
		this._isCoordContained("x", coord)
		&& this._isCoordContained("y", coord)
	) ? true : false;
}
Rectangle.prototype._getNumberOfCoordsContained = function(rect){
	var numOfCoordsContained = 0;
	for (var v = 0; v < 4; v++) {
		//console.log(v, rect.getVertex(v), this.isCoordContained( rect.getVertex(v) ));
		if (this.isCoordContained( rect.getVertex(v) )) {
			numOfCoordsContained++;
		}
	}
	return numOfCoordsContained;
}
Rectangle.prototype.isRectangleContained = function(rect){
	// All coordinates need to be contained in order to be fully contained
	return (this._getNumberOfCoordsContained(rect) == 4) ? true : false;
}
Rectangle.prototype.isRectangleIntersecting = function(rect){
	// At least one coordinate, but not all 4, should be contained 
	// in order for the rectangles to be intersecting
	var numOfCoordsContained = this._getNumberOfCoordsContained(rect);
	if (numOfCoordsContained > 0 && numOfCoordsContained < 4) {
		return true;
	}
	// Check the reverse
	numOfCoordsContained = rect._getNumberOfCoordsContained(this);
	if (numOfCoordsContained > 0 && numOfCoordsContained < 4) {
		return true;
	}
	// Check for crosses
	if (this._isCoordContained("x", rect.topLeft) 
		&& this._isCoordContained("x", rect.bottomRight)
		&& rect.topLeft.y <= this.topLeft.y
		&& rect.bottomRight.y >= this.bottomRight.y) {
		return true;
	}
	if (this._isCoordContained("y", rect.topLeft) 
		&& this._isCoordContained("y", rect.bottomRight)
		&& rect.topLeft.x <= this.topLeft.x
		&& rect.bottomRight.x >= this.bottomRight.x) {
		return true;
	}
	return false;
}
Rectangle.prototype._getMinDiff = function(xy, rect){
	// Check the minimum distance between coordinates
	return Math.min(
		Math.abs(rect.topLeft[xy] - this.topLeft[xy])
		,Math.abs(rect.topLeft[xy] - this.bottomRight[xy])
		,Math.abs(rect.bottomRight[xy] - this.topLeft[xy])
		,Math.abs(rect.bottomRight[xy] - this.bottomRight[xy])
	);
}
Rectangle.prototype.isRectangleAdjacent = function(rect){
	if ( this._getMinDiff("x", rect) <= 1
		&& (this._isCoordContained("y", rect.topLeft) 
		|| this._isCoordContained("y", rect.bottomRight)) )
	{
		return true;
	}
	if ( this._getMinDiff("y", rect) <= 1
		&& (this._isCoordContained("x", rect.topLeft) 
		|| this._isCoordContained("x", rect.bottomRight)) )
	{
		return true;
	}
	return false;
}
