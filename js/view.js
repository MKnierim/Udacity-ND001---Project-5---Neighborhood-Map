// Code for the apps view (Part of knockout.js MVVM pattern for the separation of concerns)
var view = {
	initializeMap: function() {
	// var mapDiv = $('#map-canvas'); - Does not seem to work like this
	var mapOptions = {
		center: { lat: 49.006616, lng: 8.403354},		// 49.006616, 8.403354 are latitude and longitude for Karlsruhe, Germany
		zoom: 14
		// disableDefaultUI: true
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// ----- Load custom controls
	// Create a div to hold the control.
	// var controlDiv = document.createElement('div');

	// Create the DIV to hold the control and
	// call the CenterControl() constructor passing
	// in this DIV.
	var centerControlDiv = document.createElement('div');
	var centerControl = new this.centerControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

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
		// $('#map-canvas').append('<div id="markerList">Hans mag Wurst!</div>');

		var karlsruhe = new google.maps.LatLng(49.006616, 8.403354);

		// // Set CSS for the control border
		// var controlUI = document.createElement('div');
		// // controlUI.class = 'control-outer';
		// controlUI.title = 'Click to recenter the map';
		// controlDiv.appendChild(controlUI);

		// // Set CSS for the control interior
		// var controlText = document.createElement('div');
		// // controlText.class = 'control-inner';
		// controlText.innerHTML = 'Center Map';
		// controlUI.appendChild(controlText);

		// Set CSS for the control border
	  var controlUI = document.createElement('div');
	  controlUI.style.backgroundColor = '#fff';
	  controlUI.style.border = '2px solid #fff';
	  controlUI.style.borderRadius = '3px';
	  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	  controlUI.style.cursor = 'pointer';
	  controlUI.style.marginBottom = '22px';
	  controlUI.style.textAlign = 'center';
	  controlUI.title = 'Click to recenter the map';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior
	  var controlText = document.createElement('div');
	  controlText.style.color = 'rgb(25,25,25)';
	  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	  controlText.style.fontSize = '16px';
	  controlText.style.lineHeight = '38px';
	  controlText.style.paddingLeft = '5px';
	  controlText.style.paddingRight = '5px';
	  controlText.innerHTML = 'Center Map';
	  controlUI.appendChild(controlText);

		// Setup the click event listeners: simply set the map to Karlsruhe
		google.maps.event.addDomListener(controlUI, 'click', function() {
			map.setCenter(karlsruhe)
		});
	}
};

// According to the documentation for knockout.js the view in KO is simply the HTML with declarative bindings. So maybe I should put this code here to viewmodel.js or app.js