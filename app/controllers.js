// Create controllers module

angular.module("rectanglesExercise.controllers", [])
.controller("OperationsController", function($scope){

	$scope.isIntersecting = function(){
		return $scope.rectangles[0].isRectangleIntersecting(
			$scope.rectangles[1]
		);
	}
	$scope.isContained = function(){
		var isRect1ContainedInRect2 = $scope.rectangles[1]
			.isRectangleContained( $scope.rectangles[0] );
		var isRect2ContainedInRect1 = $scope.rectangles[0]
			.isRectangleContained( $scope.rectangles[1] );
		return (isRect1ContainedInRect2 || isRect2ContainedInRect1);
	}
	$scope.isAdjacent = function(){
		return $scope.rectangles[0].isRectangleAdjacent(
			$scope.rectangles[1]
		);
	}		
})
.controller("RectangleInterfaceController", function($scope){
	$scope.vertexIndexArray = [0,1,2,3];
})
.controller("DisplayController", function($scope){
	// Combine all vertex name arrays into one array (length of 8)
	$scope.allVertexNames = $scope.rectangles[0].vertexNames.concat(
		$scope.rectangles[1].vertexNames
	);
	// Position and size the rectangles for display
	$scope.getRectangleDisplayStyle = function(rect){
		return {
			"top" 		: rect.vertex[0].y() + "px"
			,"left" 	: rect.vertex[0].x() + "px"
			,"width" 	: rect.getLength() + "px"
			,"height" 	: rect.getWidth() + "px"
		};
	}
	var	getCoordsByAllVertexIndex = function(vertexIndex){
		var rectangleIndex = Math.floor(vertexIndex/4);
		vertexIndex = vertexIndex % 4;
		return $scope.rectangles[rectangleIndex].getVertex(vertexIndex);	
	}
	$scope.getVertexDisplayStyle = function(vertexIndex){
		var coords = getCoordsByAllVertexIndex(vertexIndex);
		var halfVertexSize = $scope.vertexDisplaySize / 2;
		var fontSize = $scope.vertexDisplaySize * 0.7;
		return {
			"top"		: (coords.y - halfVertexSize) + "px"
			,"left"		: (coords.x - halfVertexSize) + "px"
			,"width" 	: $scope.vertexDisplaySize + "px"
			,"height"	: $scope.vertexDisplaySize + "px"
			,"font-size" : fontSize + "px"
			//,"line-height" : "1em"
		};
	}
	$scope.getVertexNameDisplayStyle = function(vertexIndex){
		var coords = getCoordsByAllVertexIndex(vertexIndex);
		var emSize = 16;
		return {
			"top"		: (coords.y - emSize) + "px"
			,"left"		: (coords.x - emSize) + "px"
		};			
	}
})
.controller("ExamplesController", function($scope){

	// Helper Functions for random number generation
	var getRandomIntegerBetween = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	var getRandomCoord = function(xy){
		var min = 0;
		var max = (xy == "x") ? $scope.displaySize.x : $scope.displaySize.y;
		return getRandomIntegerBetween(min, max);
	}
	
	// Add function to randomly assign vertex coords to a rectangle
	$scope.randomize = function(){
		for (var r = 0; r <= 1; r++) {
			$scope.rectangles[r].set(
				new Coords(getRandomCoord("x"), getRandomCoord("y"))
				,new Coords(getRandomCoord("x"), getRandomCoord("y"))
			);
		}
	}
	
	// Set Rectangle 2 to be intersecting
	$scope.intersect = function(){
		var r0 = $scope.rectangles[0];
		var r0vertex0 = r0.getVertex(0);
		// Now set the second rectangle...
		// Put one coordinate into the middle of the first rectangle
		var coord1 = new Coords(
			Math.round(r0vertex0.x + (r0.getLength() / 2))
			,Math.round(r0vertex0.y + (r0.getWidth() / 2))
		);
		// Put the second coordinate somewhere to the bottom right 
		// of the first first coordinate, but not off the display
		var coord2 = new Coords(
			coord1.x + getRandomIntegerBetween(1, $scope.displaySize.x - coord1.x)
			,coord1.y + getRandomIntegerBetween(1, $scope.displaySize.y - coord1.y)
		);
		$scope.rectangles[1].set(coord1, coord2);
	}
	
	// Set Rectangle 2 to be containing, wholly inside the first
	$scope.contain = function(){
		var r0 = $scope.rectangles[0];
		var r0dim = new Coords( r0.getLength(), r0.getWidth() );
		// Set topLeft coordinate to lower and right of first's topLeft
		var coord1 = new Coords(
			Math.round(r0.getVertex(0).x + (r0dim.x * getRandomIntegerBetween(1,4) / 10))
			,Math.round(r0.getVertex(0).y + (r0dim.y * getRandomIntegerBetween(1,4) / 10))
		);
		// Set bottomRight to higher and left of first's bottomRight
		var coord2 = new Coords(
			Math.round(r0.getVertex(0).x + (r0dim.x * getRandomIntegerBetween(6,9) / 10))
			,Math.round(r0.getVertex(0).y + (r0dim.y * getRandomIntegerBetween(6,9) / 10))
		);			
		$scope.rectangles[1].set(coord1, coord2);
	}
	
	// Set Rectangle 2 to be adjancent to rectangle 1
	$scope.adjacent = function(){
		// Put second rectangle next to the first
		var r0 = $scope.rectangles[0];
		var r0vertex0 = r0.getVertex(0);
		var coord1 = new Coords(
			r0.getVertex(2).x + 1
			,Math.round(r0vertex0.y + (r0.getWidth() * 0.2))
		);
		// Put the second coordinate somewhere to the bottom right 
		// of the first first coordinate, but not off the display
		var coord2 = new Coords(
			coord1.x + getRandomIntegerBetween(1, $scope.displaySize.x - coord1.x)
			,coord1.y + getRandomIntegerBetween(1, $scope.displaySize.y - coord1.y)
		);
		$scope.rectangles[1].set(coord1, coord2);
	}		
});
