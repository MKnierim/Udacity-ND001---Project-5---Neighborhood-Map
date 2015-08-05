// Code for the apps data model (Part of knockout.js MVVM pattern for the separation of concerns)
var model = {
	markerArray: ko.observableArray(),		// Observable Array to store all marker objects and automatically update the view on changes.

	// Create a marker object as a child of the Google Maps marker object. This way aditional attributes of a marker can be specified.
	MyMarker: function (markerObject, infoWindowObject, notes, extra) {
		this.mObject = markerObject;
		this.iWObject = infoWindowObject;
		this.title = ko.observable(markerObject.title);
		this.editing = ko.observable(false);
	},

	activeMarker: null,		// Stores an object of type marker which is currently being focused.

	activeInfo: null		// Stores an object of type infoWindo which belongs to the marker which is currently being focused.
};