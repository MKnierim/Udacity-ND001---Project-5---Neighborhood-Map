// Initialize the Google map
function initializeMap() {
	var mapOptions = {
		center: { lat: 49.006616, lng: 8.403354},		// 49.006616, 8.403354 are latitude and longitude for Karlsruhe, Germany
		zoom: 14
		// disableDefaultUI: true
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// This event listener calls addMarker() when the map is clicked.
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});

	// This event listener calls deleteMarker() when a marker is clicked.
	// google.maps.event.addListener(map, 'click', function(event) {
	// 	addMarker(event.latLng, map);
	// });
}

// Adds a marker to the map.
function addMarker(location, map) {
	var marker = new google.maps.Marker({
		position: location,
		// label: labels[labelIndex++ % labels.length],
		map: map,
		draggable: true
    // title: "Yay!"
	});
}

// Initialize the map after the DOM has finished loading
google.maps.event.addDomListener(window, 'load', initializeMap);