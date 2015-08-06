// Code for the apps ViewModel (Part of knockout.js MVVM pattern for the separation of concerns)

// Global variables
var map;
var KARLSRUHE = new google.maps.LatLng(49.006616, 8.403354);

var labelChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var labelIndex = 0;

// Constants for certain keyboard operations
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

// The main view model
var viewModel = {

	initializeMap: function() {
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
		viewModel.addMarker(KARLSRUHE, map, "Karlsruhe-Center");

		// ----- Add event listeners.
		// This event listener calls addMarker() when the map is clicked.
		google.maps.event.addListener(map, 'click', function(event) {
			viewModel.addMarker(event.latLng, map, "Untitled Marker");
		});

		// Setup the click event listeners. Since the custom controls are not implemented as part of the map object but rather as independent overlays, the eventHandlers have to be called by regular JS or jQuery in this case.

		// Event handler for marker list clicking
		// $('#marker-list').click(function(){
		// 	var selectedMarker = $( "#marker-list option:selected" ).text(); // Get name of selected marker from list
		// 	console.log(selectedMarker);
		// 	// var catObject = octopus.getCat(selectedCat);
		// });
	},

	addMarker: function(location, map, title) {
		var labelChar = labelChars[labelIndex++ % labelChars.length];

		// Maybe I should move this to view.js? There was a problem with the labelChar, so this needs to be checked if I chose to refactor.
		var customLabel = {
			color: '#fff',
			text: labelChar,
			fontWeight: 'bold'
		};

		// Creates and adds a marker to the map
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			icon: view.greenIcon,
			label: customLabel,
			title: title
		});

		// Creates an info window for the marker
		var infoWindow = new google.maps.InfoWindow({
			content: view.infoWindowTemplate(marker.title)
		});

		// Extend marker with additional (observable) parameters
		var myMarker = new model.MyMarker(marker, infoWindow,'','')

		// Add marker to observable array in model.js
		model.markerArray.push(myMarker);

		// This event listener opens the info window on the marker when it is clicked.
		google.maps.event.addListener(marker, 'click', function() {
			viewModel.updateActiveMarker(myMarker);
		});

		// This event listener sets the marker to be displayed as inacive when the info window is closed manually
		google.maps.event.addListener(infoWindow, 'closeclick', function() {
			myMarker.mObject.setIcon(view.greenIcon);
			myMarker.active(false);
			model.activeMarker = null;
		});

		// Activate new marker.
		this.updateActiveMarker(myMarker);
	},

	// Edit the title of a marker
	editMarker: function(marker) {
		marker.editing(true);
		marker.previousTitle = marker.title();
	},

	// Stop editing an item and save the new title. If the title is empty set it to "Untitled Marker".
	saveEditing: function(marker) {
		marker.editing(false);

		var title = marker.title();
		var trimmedTitle = title.trim();

		// Observable value changes are not triggered if they're consisting of whitespaces only.
		// Therefore the untrimmed version is compared with a trimmed one to check whether anything changed.
		if (title !== trimmedTitle) {
			marker.title(trimmedTitle);
			console.log("Yay if!");
		}

		if (!trimmedTitle) {
			marker.title("Untitled Marker");
		}

		// In the end, change the title on the GoogleMaps Marker Object manually.
		marker.mObject.setTitle(marker.title());
		marker.iWObject.setContent(view.infoWindowTemplate(marker.title()));
	},

	// Cancel editing an item and revert to the previous content.
	cancelEditing: function(marker) {
		marker.editing(false);
		marker.title(marker.previousTitle);
	},

	// Delete marker by removing it from the array and also removing it from the map.
	deleteMarker: function(marker) {
		marker.mObject.setMap(null);
		model.markerArray.remove(marker);
		marker.mObject = null;
	},

	updateActiveMarker: function(marker) {
		if (model.activeMarker != null && model.activeMarker != marker) {
			// If there is actually a new marker that should be activated change icon and close info window on a previously active marker.
			model.activeMarker.iWObject.close();
			model.activeMarker.mObject.setIcon(view.greenIcon);
			model.activeMarker.active(false);
		}
		// Set and activate the new marker
		marker.active(true);
		model.activeMarker = marker;
		model.activeMarker.mObject.setIcon(view.orangeIcon);
		model.activeMarker.iWObject.open(map,model.activeMarker.mObject);
	}
};

// Initialize the map after the DOM has finished loading.
$(function() {
	viewModel.initializeMap();

	// Activate Knockout bindings.
	ko.applyBindings(model);
});