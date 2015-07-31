// Code for the apps data model (Part of knockout.js MVVM pattern for the separation of concerns)
var model = {
	markerArray: ko.observableArray(),		// Observable Array to store all marker objects and automatically update the view on changes.

	activeMarker: null,		// Stores an object of type marker which is currently being focused.

	activeInfo: null		// Stores an object of type infoWindo which belongs to the marker which is currently being focused.
};

// Create a marker object as a child of the Google Maps marker object. This way aditional attributes of a marker can be specified.
// var Marker = function () {
// 	this.gmObject = function(location, map, title) {
// 		var gmMarker = new google.maps.Marker({
// 			position: location,
// 			label: String(model.markerArray().length+1),
// 			map: map,
// 			draggable: true,
// 			title: "#" + (model.markerArray().length+1) + " - " + title
// 		});

// 	this.specialAttribute = "";

// }