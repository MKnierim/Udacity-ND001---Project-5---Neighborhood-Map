var view = {
	// Several templates for marker info windows.
	infoWindowTemplate : function(title, fourSquareContent, streetViewContent) {
		var htmlstring = '<div class="iw-container">' +
			'<h3>' + title + '</h3>' +
			'<hr>' +
			'<div><small>' + fourSquareContent + '</small></div>' +
			'<hr>' +
			'<div><img class="iw-img" src="' + streetViewContent + '"></div>' +
			'</div>';
		return htmlstring;
	},

	infoWindowEmpty : function(title) {
		var htmlstring = '<div class="iw-container">' +
			'<h3>' + title + '</h3>' +
			'<hr>' +
			'<div><small>No additional information was found on FourSqaure</small></div>' +
			'<hr>' +
			'<div><small>No image was found for this location on GoogleStreetView</small></div>' +
			'</div>';
		return htmlstring;
	},

	infoWindowError : function(title) {
		var htmlstring = '<div class="iw-container">' +
			'<h3>' + title + '</h3>' +
			'<hr>' +
			'<div><small>No information can be retrieved at this time.</small></div>' +
			'</div>';
		return htmlstring;
	},

	// Template for marker label
	customLabel : function(labelChar) {
		var labelObject = {
			color: '#fff',
			text: labelChar,
			fontWeight: 'bold'
		};
		return labelObject;
	},

	// A custom designed icon for the map in two colors to show activation state.
	greenIcon : {
		url: 'imgs/icons/marker-green.png',
		labelOrigin: new google.maps.Point(12, 12)
	},

	orangeIcon : {
		url: 'imgs/icons/marker-orange.png',
		labelOrigin: new google.maps.Point(12, 12)
	},

	// An array of styles for the fun map type. Created by using the offered wizard:
	// http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
	udacityMapStyle : [
		{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [
				{ "color": "#ffa700" }
			]
		},{
			"featureType": "administrative",
			"elementType": "labels.text.stroke",
			"stylers": [
				{ "color": "#FFFFFF" },
				{ "visibility": "on" }
			]
		},{
			"featureType": "landscape.man_made",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#224761" }
			]
		},{
			"featureType": "landscape.natural",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#1d3b50" }
			]
		},{
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#80c7da" }
			]
		},{
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#ffa700" }
			]
		},{
			"featureType": "poi",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#326488" }
			]
		},{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
				{ "color": "#FFFFFF" }
			]
		},{
			"featureType": "poi",
			"elementType": "labels.text.stroke",
			"stylers": [
				{ "color": "#1b394d" }
			]
		},{
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#baff00" }
			]
		},{
			"featureType": "poi.attraction",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#ffa700" }
			]
		},{
			"featureType": "poi.business",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#0e2637" }
			]
		},{
			"featureType": "poi.school",
			"stylers": [
				{ "color": "#f6ff00" }
			]
		},{
			"featureType": "poi.sports_complex",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#ffcc00" }
			]
		},{
			"featureType": "road",
			"elementType": "labels.text.fill",
			"stylers": [
				{ "color": "#102e42" }
			]
		},{
			"featureType": "road",
			"elementType": "labels.text.stroke",
			"stylers": [
				{ "color": "#FFFFFF" }
			]
		},{
			"featureType": "transit",
			"stylers": [
				{ "visibility": "off" }
			]
		}
	]
};