// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var map;
var karlsruhe = new google.maps.LatLng(49.006616, 8.403354);

var labelChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var labelIndex = 0;

// Specifies a custom designed icon for the map. Maybe I could nest this in a newly created Marker object (a child of the GoogleMapsMarker)?
var greenIcon = {
	url: 'imgs/icons/marker-green.png',
	labelOrigin: new google.maps.Point(12, 12)
};

var orangeIcon = {
	url: 'imgs/icons/marker-orange.png',
	labelOrigin: new google.maps.Point(12, 12)
};

var viewModel = {

	initializeMap: function() {
		var mapOptions = {
			center: karlsruhe,
			zoom: 14,
			disableDefaultUI: true
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Initialize a marker for testing purposes.
		viewModel.addMarker(karlsruhe, map, "Karlsruhe-Center");

		// ----- Add event listeners.
		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			viewModel.addMarker(event.latLng, map, "Untitled Marker");
		});

		// Setup the click event listeners. Since the custom controls are not implemented as part of the map object but rather as independent overlays, the eventHandlers have to be called by regular JS or jQuery in this case.
		
		// Event handler for marker list clicking
		$('#marker-list select').click(function(){
			var selectedMarker = $( "#marker-list select option:selected" ).text(); // Get name of selected marker from list
			console.log(selectedMarker);
			// var catObject = octopus.getCat(selectedCat);
		});
	},

	addMarker: function(location, map, title) {
		var labelChar = labelChars[labelIndex++ % labelChars.length];

		var customLabel = {
			color: '#fff',
			text: labelChar,
			fontWeight: 'bold'
		};

		// Creates and adds a marker to the map
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: greenIcon,
			label: customLabel,
			draggable: true,
			title: "#" + labelChar + " - " + title
		});

		// Creates an info window for the marker
		var infoWindow = new google.maps.InfoWindow({
			content: marker.title
		});

		// This event listener opens the info window on the marker when it is clicked.
		google.maps.event.addListener(marker, 'click', function() {
			viewModel.updateActiveMarker(marker, infoWindow);
		});

		// This event listener sets the marker to be displayed as inacive when the info window is closed manually
		google.maps.event.addListener(infoWindow, 'closeclick', function() {
			marker.setIcon(greenIcon);
			model.activeMarker = null;
			model.activeInfo = null;
		});

		// Add marker to observable array in model object and activate new marker.
		model.markerArray.push(marker);
		this.updateActiveMarker(marker, infoWindow);
	},

	updateActiveMarker: function(marker, infoWindow) {
		if (model.activeMarker != null && model.activeMarker != marker) {
			// If there is actually a new marker that should be activated change icon and close info window on a previously active marker.
			model.activeInfo.close();
			// infoWindow.close(map, model.activeMarker);
			model.activeMarker.setIcon(greenIcon);
		};

		// Set and activate the new marker
		model.activeMarker = marker;
		model.activeInfo = infoWindow;
		model.activeMarker.setIcon(orangeIcon);
		infoWindow.open(map,model.activeMarker);
	}
};

// Initialize the map after the DOM has finished loading.
$(function() {
	viewModel.initializeMap();

	// Activate Knockout bindings.
	ko.applyBindings(model);
});