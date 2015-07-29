// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var map;
var karlsruhe = new google.maps.LatLng(49.006616, 8.403354);

var viewModel = {

	initializeMap: function() {
		var mapOptions = {
			center: karlsruhe,
			zoom: 14
			// disableDefaultUI: true
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Initialize a marker for testing purposes
		viewModel.addMarker(karlsruhe, map);

		// ----- Add event listeners
		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			viewModel.addMarker(event.latLng, map);
		});

		// Setup the click event listeners: simply set the map to Karlsruhe
		// 	google.maps.event.addDomListener(controlUI, 'click', function() {
		// 		map.setCenter(karlsruhe);
		// 	});

	},

	addMarker: function(location, map) {		// Adds a marker to the map.
		var marker = new google.maps.Marker({
			position: location,
			// label: labels[labelIndex++ % labels.length],
			map: map,
			draggable: true,
			title: "Yay!"
		});

	// Add marker to observable array in model object
	model.markerArray.push(marker);
	}
};

// Initialize the map after the DOM has finished loading
$(function() {
	viewModel.initializeMap();

	// Activate Knockout bindings
	ko.applyBindings(model);
});