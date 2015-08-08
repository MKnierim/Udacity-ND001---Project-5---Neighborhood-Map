// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables.
var map;

// Marker constants for the initialization of the map.
var KARLSRUHE = new google.maps.LatLng(49.006616, 8.403354);
var DEFAULTMARKERS = [
	{latitude: 49.016666, longitude: 8.404958},	// Karlsruhe Palace Gardens
	{latitude: 49.026714, longitude: 8.408566},	// Field Hockey Club KTV
	{latitude: 49.010032, longitude: 8.411216},	// Karlsruhe Institute of Technology
	{latitude: 49.008039, longitude: 8.399974},	// Friedrichsplatz
	{latitude: 49.009520, longitude: 8.403937}	// Market place
];

// Constants and variables for the labels of map markers.
var LABELCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var labelIndex = 0;

// Create a marker object as a child of the Google Maps marker object. This way aditional attributes of a marker can be specified.
var MyMarker = function (markerObject, infoWindowObject) {
	this.mObject = markerObject;
	this.iWObject = infoWindowObject;
	this.title = ko.observable(markerObject.title);
	this.active = ko.observable(false);
};

// The main view model
var ViewModel = function () {

	var self = this;

	// Observable Array to store all marker objects and automatically update the view on changes.
	self.markerArray = ko.observableArray();

	// Stores an object of type marker which is currently being focused.
	self.activeMarker = null;

	// Stores a string which is used to filter markers in the list.
	self.searchFilter = ko.observable('');

	// API requests for additional information to add to a marker.
	self.apiRequest = function(marker) {
		// API variables for additional marker information.
		var fourSquareApi = 'https://api.foursquare.com/v2/venues/search' +
												'?client_id=WV1KUOOG0RACYHRR2ZDQTQS1HY1GHKSAJ5WJT3CLGXYYAY0E' +
												'&client_secret=JJWK2Y2KT1SOB3AASF3SW2TNCKROHSMOCXHEALYRP3LOOIRT' +
												'&v=20150401&limit=1';
		var googleStreetView = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&location=';
		var lat = marker.mObject.position.lat();
		var lng = marker.mObject.position.lng();
		var url = fourSquareApi + '&ll=' + lat + ',' + lng;

		// Issue the asynchronous request for third-party data on location.
		$.getJSON(url, function(response) {
				var venue = response.response.venues[0];

				// Checks if a venue could be found through FourSquare API
				if (venue) {
					// For every entry in the formattedAddress Array construct a string to be displayed later.
					var venueAddress = '';
					for (var i = 0; i < venue.location.formattedAddress.length; i++) {
						venueAddress += venue.location.formattedAddress[i] + '<br>';
					}

					// Construct and issue the GoogleStreetView image request.
					var streetPhotoUrl = googleStreetView + lat + ',' + lng;

					// If the request is run on an untitled marker, the marker title is updated automatically.
					if (marker.title() == 'Untitled Marker'){
						marker.title(venue.name);
						marker.mObject.setTitle(marker.title());
					}

					// Pass the new additonal marker information to the infoWindow object.
					marker.iWObject.setContent(view.infoWindowTemplate(marker.title(),
						venueAddress,
						streetPhotoUrl));
				}
				else {
					// If no venue is returned by the FourSquareRequest the infoWindow object is updated accordingly.
					marker.iWObject.setContent(view.infoWindowEmpty(marker.title()));
				}

		}).error(function(err) {
				// If the request returns an error the infoWindow object is updated accordingly.
				marker.iWObject.setContent(view.infoWindowError(marker.title()));
		});
	};

	// Function to intialize the map at the beginning.
	self.initializeMap = function() {
		// Create a new StyledMapType object, passing it the array of styles,
		// as well as the name to be displayed on the map type control.
		var styledMap = new google.maps.StyledMapType(view.udacityMapStyle,
			{name: "Udacity Style"});

		var mapOptions = {
			center: KARLSRUHE,
			zoom: 14,
			disableDefaultUI: true,
			mapTypeControl: true,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, 'udacity_style']
			}
		};

		// Create and add map to designated div.
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		//Associate the styled map with the MapTypeId.
		map.mapTypes.set('udacity_style', styledMap);

		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			self.addMarker(event.latLng, map, "Untitled Marker");
		});

		// Initialize default markers.
		for (var i=0; i < DEFAULTMARKERS.length; i++){
			self.addMarker(new google.maps.LatLng(DEFAULTMARKERS[i].latitude, DEFAULTMARKERS[i].longitude), map, "Untitled Marker");
		}
	};

	self.addMarker = function(location, map, title) {
		// Evaluate the next label character.
		var labelChar = LABELCHARS[labelIndex++ % LABELCHARS.length];

		// Create and adds a marker to the map.
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: view.greenIcon,
			label: view.customLabel(labelChar),
			title: title
		});

		// Create an info window for the marker.
		var infoWindow = new google.maps.InfoWindow({
			content: view.infoWindowEmpty(marker.title)
		});

		// Extend marker with additional (observable) parameters.
		var myMarker = new MyMarker(marker, infoWindow);

		// Call additional information on the marker through third-party APIs.
		self.apiRequest(myMarker);

		// Add marker to observable array
		self.markerArray.push(myMarker);

		// This event listener opens the info window on the marker when it is clicked.
		google.maps.event.addListener(marker, 'click', function() {
			self.updateActiveMarker(myMarker);
		});

		// This event listener sets the marker to be displayed as inactive when the info window is closed manually.
		google.maps.event.addListener(infoWindow, 'closeclick', function() {
			myMarker.mObject.setIcon(view.greenIcon);
			myMarker.active(false);
			self.activeMarker = null;
		});
	};

	// Delete marker by removing it from the array and also removing it from the map.
	self.deleteMarker = function(marker) {
		// Check if marker was the last one in the line and if so set the labelCount back so
		// the next new marker will have the next following character again.
		if (LABELCHARS.indexOf(marker.mObject.label.text) == labelIndex - 1) {
			labelIndex--;
		}

		// Check if the marker to delete is the currently active marker and if so set the activeMarker to null.
		if (self.activeMarker == marker) {
			self.activeMarker = null;
		}

		// Then delete the chosen marker.
		marker.mObject.setMap(null);
		self.markerArray.remove(marker);
		marker.mObject = null;
	};

	// Set and activate a new marker.
	self.activateMarker = function(marker) {
		marker.active(true);
		self.activeMarker = marker;
		self.activeMarker.mObject.setIcon(view.orangeIcon);
		self.activeMarker.iWObject.open(map,self.activeMarker.mObject);
	};

	// Deactivate a previously active marker.
	self.deactivateMarker = function(marker) {
		marker.iWObject.close();
		marker.mObject.setIcon(view.greenIcon);
		marker.active(false);
		self.activeMarker = null;
	};

	self.updateActiveMarker = function(marker) {
		if (self.activeMarker) {
			self.deactivateMarker(self.activeMarker);
		}
		self.activateMarker(marker);
	};

	self.showMarkers = function(markers) {
		// First deactivate all markers if a filter is applied
		// (i.e. the passed array is not the full markerArray).
		if (markers !== self.markerArray()) {
			self.markerArray().forEach(function(element, index, array) {
				element.mObject.setMap(null);
			});
		}

		// Then pass the map to all markers which should be displayed.
		markers.forEach(function(element, index, array) {
			element.mObject.setMap(map);
		});
	};

	// This function checks to see if there is anything to be filtered.
	// If there's nothing to be filtered, display the entire item list and all the markers.
	self.filteredMarkers = ko.computed(function () {
		// Convert search string to lower case to bypass case-sensitive matching.
		var filter = self.searchFilter().toLowerCase();

		// Use Knockout's arrayFilter utility function to pass in the markerArray and
		// control which items are filtered based on a match of the search string and the
		// marker title. For additional information see:
		// http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
		if (!filter) {
			// // If no filter is set, show all the markers by passing the markerArray with all markers.
			self.showMarkers(self.markerArray());
			return self.markerArray();
		}
		else {
			var markerSet = ko.utils.arrayFilter(self.markerArray(), function(marker) {
					return marker.mObject.title.toLowerCase().indexOf(filter) !== -1;
			});

			self.showMarkers(markerSet);
			return markerSet;
		}
	}, self);

};

// Initialize the map after the DOM has finished loading.
$(function() {
	// Bind a new instance of the view model to the page.
	var viewModel = new ViewModel();

	// Activate Knockout bindings.
	ko.applyBindings(viewModel);

	// Initialize the map
	viewModel.initializeMap();

	// Create event listener for menu (for mobile users).
	$( '.menu-btn' ).click(function(){
		$('.responsive-menu').toggleClass('expand');
	});
});