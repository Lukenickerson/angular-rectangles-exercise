/*
	Angular Rectangles Exercise
	By Luke Nickerson, 2015
	Requires window.Rectangle from rectangle.js
	and window.Coords from coords.js
*/
// Check for required global classes
// The Rectangle class contains generic geometric functionality
if (typeof Rectangle !== 'function') { console.error("Rectangle is required"); }
// The Coords class contains generic 2d coordinate functions
if (typeof Coords !== 'function') { console.error("Coords is required"); }

// Define the angular app
var app = angular.module(
	"rectanglesExercise", 
	["rectanglesExercise.controllers"]
)
.run(function($rootScope){
	// Define the two rectangles in the root
	$rootScope.rectangles = [
		new Rectangle(100, 70, 240, 140, ["A","B","C","D"])
		,new Rectangle(20, 20, 130, 100, ["E", "F", "G", "H"])
	];
	
	// Extend the basic rectangle functionality
	// with things that are specific to this app
	$rootScope.rectangles[0].name = "One";
	$rootScope.rectangles[1].name = "Two";
	
	// Display
	$rootScope.displaySize = new Coords(320, 200);
	$rootScope.vertexDisplaySize = 20;

});
