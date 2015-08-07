// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables.
var map;

// Marker constants for the initialization of the map.
var KARLSRUHE = new google.maps.LatLng(49.006616, 8.403354);
var DEFAULTMARKERS = [
	{latitude: 49.015677, longitude: 8.402064},	// Karlsruhe Palace Gardens
	{latitude: 49.026714, longitude: 8.408566},	// Field Hockey Club KTV
	{latitude: 49.011511, longitude: 8.415958}	// Karlsruhe Institute of Technology
];

// Constants and variables for the labels of map markers.
var LABELCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var labelIndex = 0;

// Constants for certain keyboard operations.
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

// A factory function to create binding handlers for specific keycodes.
function keyhandlerBindingFactory(keyCode) {
	return {
		init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
			var wrappedHandler, newValueAccessor;

			// Wrap the handler with a check for the enter key.
			wrappedHandler = function (data, event) {
				if (event.keyCode === keyCode) {
					valueAccessor().call(this, data, event);
				}
			};

			// Create a valueAccessor with the options that we would want to pass to the event binding.
			newValueAccessor = function () {
				return {
					keyup: wrappedHandler
				};
			};

			// Call the real event binding's init function.
			ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
		}
	};
}

// A custom binding to handle the enter key.
ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

// Another custom binding, this time to handle the escape key.
ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

// Wrapper to hasFocus that also selects text and applies focus async.
ko.bindingHandlers.selectAndFocus = {
	init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
		ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
		ko.utils.registerEventHandler(element, 'focus', function () {
			element.focus();
		});
	},
	update: function (element, valueAccessor) {
		ko.utils.unwrapObservable(valueAccessor()); // For dependency
		// ensure that element is visible before trying to focus.
		setTimeout(function () {
			ko.bindingHandlers.hasFocus.update(element, valueAccessor);
		}, 0);
	}
};

// Create a marker object as a child of the Google Maps marker object. This way aditional attributes of a marker can be specified.
var MyMarker = function (markerObject, infoWindowObject) {
	this.mObject = markerObject;
	this.iWObject = infoWindowObject;
	this.title = ko.observable(markerObject.title);
	this.editing = ko.observable(false);
	this.active = ko.observable(false);
};

// The main view model
var ViewModel = function () {

	var self = this;

	// Observable Array to store all marker objects and automatically update the view on changes.
	self.markerArray = ko.observableArray();

	// Stores an object of type marker which is currently being focused.
	self.activeMarker = null;		// Should I make this an observable?

	// Stores a string which is used to filter markers in the list.
	self.searchFilter = ko.observable('');

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
			return self.markerArray();
		}
		else {
			return ko.utils.arrayFilter(self.markerArray(), function(marker) {
	        return marker.mObject.title.toLowerCase().indexOf(filter) !== -1;
	    });
		};
	}, self);


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
		};
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
		};

		// Check if the marker to delete is the currently active marker and if so set the activeMarker to null.
		if (self.activeMarker == marker) {
			self.activeMarker = null;
		};

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

	// Edit the title of a marker.
	self.editMarker = function(marker) {
		marker.editing(true);
		marker.previousTitle = marker.title();
	};

	// Stop editing an item and save the new title. If the title is empty set it to "Untitled Marker".
	self.saveEditing = function(marker) {
		marker.editing(false);

		var title = marker.title();
		var trimmedTitle = title.trim();

		// Observable value changes are not triggered if they're consisting of whitespaces only.
		// Therefore the untrimmed version is compared with a trimmed one to check whether anything changed.
		if (title !== trimmedTitle) {
			marker.title(trimmedTitle);
		}

		if (!trimmedTitle) {
			marker.title("Untitled Marker");
		}

		// In the end, change the title on the GoogleMaps Marker Object manually.
		marker.mObject.setTitle(marker.title());
		marker.iWObject.setContent(view.infoWindowTemplate(marker.title()));
	};

	// Cancel editing an item and revert to the previous content.
	self.cancelEditing = function(marker) {
		marker.editing(false);
		marker.title(marker.previousTitle);
	};

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

		// var $windowContent = $('#content');

		var url = fourSquareApi + '&ll=' + lat + ',' + lng;

		// Issue the asynchronous request for third-party data on location.
		$.getJSON(url, function(response) {
				var venue = response.response.venues[0];

				// Checks if a venue could be found through FourSquare API
				if (venue) {
					var venueAddress = '';
					// For every entry in the formattedAddress Array construct a string to be displayed later.
					for (var i = 0; i < venue.location.formattedAddress.length; i++) {
						venueAddress += venue.location.formattedAddress[i] + '<br>';
					};
					var streetPhotoUrl = googleStreetView + lat + ',' + lng;

					// If the request is run on an untitled marker, the marker title is updated automatically.
					if (marker.title() == 'Untitled Marker'){
						marker.title(venue.name);
						marker.mObject.setTitle(marker.title());
					}

					marker.iWObject.setContent(view.infoWindowTemplate(marker.title(),
						venueAddress,
						streetPhotoUrl));
				}
				else {
					marker.iWObject.setContent(view.infoWindowEmpty(marker.title()));
				}

				// $windowContent.append('<p>' + venuePhone + '</p>');
				// $windowContent.append('<p>' + venueAddress + '</p>');
				// $windowContent.append('<img class="street-img" src="' + streetPhotoUrl +
				// 		'">');
		}).error(function(err) {
				console.log('No information can be retrieved at this time.');
				// $windowContent.text('No information can be retrieved at this time.');
		});
	};
};

// Initialize the map after the DOM has finished loading.
$(function() {
	// Bind a new instance of the view model to the page.
	var viewModel = new ViewModel;

	// Activate Knockout bindings.
	ko.applyBindings(viewModel);

	// Initialize the map
	viewModel.initializeMap();
});