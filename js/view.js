// Code for the apps view (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var map;
var karlsruhe = new google.maps.LatLng(49.006616, 8.403354);

var view = {
	initializeMap: function() {
		var mapOptions = {
			center: karlsruhe,
			zoom: 14
			// disableDefaultUI: true
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Initialize a marker for testing purposes
		viewModel.addMarker(karlsruhe, map);

		// ----- Load custom controls
		// Create button to return view to default center
		// var centerControl = new this.centerControl();

		// Create list to display set markers
		var markerList = new this.markerListControl();

		// ----- Add event listeners
		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			viewModel.addMarker(event.latLng, map);
		});

	},

	// centerControl: function() {
	// 	var centerControlDiv = document.createElement('div');
	// 	centerControlDiv.id = "center-control";
	// 	centerControlDiv.index = 1;

	// 	// Set CSS for the control border
	//   var controlUI = document.createElement('div');
	//   controlUI.title = 'Click to recenter the map';
	//   controlUI.className = "control-outer";
	//   centerControlDiv.appendChild(controlUI);

	//   // Set CSS for the control interior
	//   var controlText = document.createElement('div');
	//   controlText.innerHTML = 'Center Map';
	//   controlText.className = "control-inner";
	//   controlUI.appendChild(controlText);

	//   // Add button to map
	//   map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);

	// 	// Setup the click event listeners: simply set the map to Karlsruhe
	// 	google.maps.event.addDomListener(controlUI, 'click', function() {
	// 		map.setCenter(karlsruhe);
	// 	});
	// },

	markerListControl: function() {
		var markerListDiv = document.createElement('div');
		markerListDiv.id = "marker-list";
		markerListDiv.index = 2;

		// Set CSS for the control border
	  var controlUI = document.createElement('div');
	  // controlUI.title = 'Click to recenter the map';
	  controlUI.className = "control-outer";
	  markerListDiv.appendChild(controlUI);

	  // Set CSS for the control interior
	  var controlForm = document.createElement('form');
	  controlForm.id = "marker-list-form";
	  var formSelect = document.createElement('select');
	  formSelect.setAttribute("data-bind", "options: markerArray, optionsText: 'title'");
	  formSelect.setAttribute("size", 10);
	  formSelect.setAttribute("multiple", true);

	  controlForm.appendChild(formSelect);
	  controlUI.appendChild(controlForm);

	  // Add list to map
	  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(markerListDiv);

		// Setup the click event listeners
		// google.maps.event.addDomListener(controlUI, 'click', function() {
		// 	map.setCenter();
		// });
	}
};

// Initialize the map after the DOM has finished loading
$(function() {
	view.initializeMap();

	// Activate Knockout bindings
	ko.applyBindings(model);
});