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

		// Initialize a marker for testing purposes.
		viewModel.addMarker(karlsruhe, map, "Karlsruhe-Center");

		// ----- Add event listeners.
		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			viewModel.addMarker(event.latLng, map, "Untitled Marker");
		});

		// Setup the click event listeners: simply set the map to Karlsruhe
		// Since the custom controls are not implemented as part of the map object but rather as independent overlays, the eventHandlers have to be called by regular JS or jQuery in this case.
		var centerControl = $('#center-control .control-inner');
		centerControl.click(function() {
			map.setCenter(karlsruhe);
		});
	},

	addMarker: function(location, map, title) {
		// Specifies a custom designed icon for the map.
		var greenIcon = {
			url: 'imgs/icons/marker-green.png',
			labelOrigin: new google.maps.Point(12, 12)
		};

		var orangeIcon = {
			url: 'imgs/icons/marker-orange.png',
			labelOrigin: new google.maps.Point(12, 12)
		};

		// Specifies a label designed to match the custom icon.
		var customLabel = {
			color: '#fff',
			text: String(model.markerArray().length+1),
			fontWeight: 'bold'
		};

		// Creates and adds a marker to the map
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			label: customLabel,
			icon: greenIcon,
			// cursor: 'pointer', did not seem to work like this
			draggable: true,
			title: "#" + (model.markerArray().length+1) + " - " + title
		});

		// Creates an info window for the marker
		var infoWindow = new google.maps.InfoWindow({
			content: marker.title
		});

		// This event listener opens the info window on the marker when it is clicked.
		google.maps.event.addListener(marker, 'click', function() {
			marker.setIcon(orangeIcon);		// Change appearance of marker to show activation
			infoWindow.open(map,marker);
		});

	// Add marker to observable array in model object.
	model.markerArray.push(marker);
	}
};

// Initialize the map after the DOM has finished loading.
$(function() {
	viewModel.initializeMap();

	// Activate Knockout bindings.
	ko.applyBindings(model);
});