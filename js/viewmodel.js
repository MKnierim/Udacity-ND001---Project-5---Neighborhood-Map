// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)
var viewModel = {
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