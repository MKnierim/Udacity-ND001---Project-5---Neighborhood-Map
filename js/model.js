// Code for the apps data model (Part of knockout.js MVVM pattern for the separation of concerns)
var model = {
	// Observable Array to store all marker objects and automatically update the view on changes.
	markerArray: ko.observableArray(),

	filteredMarkers: ko.computed(function() {
		return this.markerArray;
	}),

	// Create a marker object as a child of the Google Maps marker object. This way aditional attributes of a marker can be specified.
	MyMarker: function (markerObject, infoWindowObject, notes, extra) {
		this.mObject = markerObject;
		this.iWObject = infoWindowObject;
		this.title = ko.observable(markerObject.title);
		this.editing = ko.observable(false);
		this.active = ko.observable(false);
	},

	// Stores an object of type marker which is currently being focused.
	activeMarker: null,
};