// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var map;
var KARLSRUHE = new google.maps.LatLng(49.006616, 8.403354);

// Constants and variables for the labels of map markers.
var LABELCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var labelIndex = 0;

// Constants for certain keyboard operations
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

// API variables
// var foursquareApi = 'https://api.foursquare.com/v2/venues/search?client_id=' +
// 		'3P0CNNUW5YA1QIJAQUVRR0H4UI4FVASXURVLXGP4AOMAHXIM&client_secret=' +
// 		'NJFWJLYRXMAHO2W2F1SIGOTA5LMHMSUTGLM2XBRAXV5YMUBM&v=20150401';
// var googleStreetview = 'https://maps.googleapis.com/maps/api/streetview?size=' +
// 		'300x150&location=';

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

		// Initialize a marker for testing purposes.
		self.addMarker(KARLSRUHE, map, "Karlsruhe-Center");

		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			self.addMarker(event.latLng, map, "Untitled Marker");
		});
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
			content: view.infoWindowTemplate(marker.title)
		});

		// Extend marker with additional (observable) parameters.
		var myMarker = new MyMarker(marker, infoWindow);

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

		// Activate new marker.
		self.updateActiveMarker(myMarker);
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

	self.updateActiveMarker = function(marker) {
		// Check if there is currently a marker active and deactivate it.
		if (self.activeMarker != null && self.activeMarker != marker) {
			self.activeMarker.iWObject.close();
			self.activeMarker.mObject.setIcon(view.greenIcon);
			self.activeMarker.active(false);
			self.activeMarker = null;
		};

		// Set and activate the new marker.
		marker.active(true);
		self.activeMarker = marker;
		self.activeMarker.mObject.setIcon(view.orangeIcon);
		self.activeMarker.iWObject.open(map,self.activeMarker.mObject);
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

	// self.apiRequest = function(marker) {
	// 	var lat = marker.position.lat();
	// 	var lng = marker.position.lng();

	// 	return 'latitude' + lat + '& longitude: ' + lng;
	// 	// var $windowContent = $('#content');

	// 	// var url = foursquareApi + '&ll=' + lat + ',' + lng + '&query=\'' +
	// 	// 		marker.title + '\'&limit=1';

	// 	// $.getJSON(url, function(response) {
	// 	// 		var venue = response.response.venues[0];
	// 	// 		var venuePhone = venue.contact.formattedPhone;
	// 	// 		var venueAddress = venue.location.formattedAddress;
	// 	// 		var venueStreet = venue.location.address;
	// 	// 		var venueCity = venue.location.city;
	// 	// 		var venueCountry = venue.location.country;
	// 	// 		var venueLocation = venueStreet + venueCity + venueCountry;
	// 	// 		var streetPhotoUrl = googleStreetview + venueLocation;

	// 	// 		// Handles undefined error if phone number cannot be found
	// 	// 		if (venuePhone === undefined) {
	// 	// 				venuePhone = '<i>Could not find phone number for this location<i>';
	// 	// 		} else {
	// 	// 				venuePhone = venuePhone;
	// 	// 		}

	// 	// 		$windowContent.append('<p>' + venuePhone + '</p>');
	// 	// 		$windowContent.append('<p>' + venueAddress + '</p>');
	// 	// 		$windowContent.append('<img class="street-img" src="' + streetPhotoUrl +
	// 	// 				'">');
	// 	// }).error(function(err) {
	// 	// 		$windowContent.text('No information can be retrieved at this time.');
	// 	// });
	// };
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