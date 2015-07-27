// Code for the apps view (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var karlsruhe = new google.maps.LatLng(49.006616, 8.403354);

var view = {
	initializeMap: function() {
	// var mapDiv = $('#map-canvas'); - Does not seem to work like this
	var mapOptions = {
		center: karlsruhe,
		zoom: 14
		// disableDefaultUI: true
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// ----- Load custom controls
	// Create button to return view to default center
	var centerControlDiv = document.createElement('div');
	centerControlDiv.id = "center-control";
	var centerControl = new this.centerControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);

	// ----- Add event listeners
	// This event listener calls addMarker() when the map is clicked.
	google.maps.event.addListener(map, 'click', function(event) {
		viewModel.addMarker(event.latLng, map);
	});

	// This event listener calls deleteMarker() when a marker is clicked.
	// google.maps.event.addListener(map, 'click', function(event) {
	// 	addMarker(event.latLng, map);
	// });
	},

	centerControl: function(controlDiv, map) {
		// Set CSS for the control border
	  var controlUI = document.createElement('div');
	  controlUI.title = 'Click to recenter the map';
	  controlUI.className = "control-outer";
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior
	  var controlText = document.createElement('div');
	  controlText.innerHTML = 'Center Map';
	  controlText.className = "control-inner";
	  controlUI.appendChild(controlText);

		// Setup the click event listeners: simply set the map to Karlsruhe
		google.maps.event.addDomListener(controlUI, 'click', function() {
			map.setCenter(karlsruhe)
		});
	}
};

// According to the documentation for knockout.js the view in KO is simply the HTML with declarative bindings. So maybe I should put this code here to viewmodel.js or app.js