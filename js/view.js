var view = {
	// Specifies a custom designed icon for the map.
	greenIcon : {
		url: 'imgs/icons/marker-green.png',
		labelOrigin: new google.maps.Point(12, 12)
	},

	orangeIcon : {
		url: 'imgs/icons/marker-orange.png',
		labelOrigin: new google.maps.Point(12, 12)
	},

	// Create an array of styles for the fun map type. Created by using the offered wizard at: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  funMapStyle : [
	  {
	    "featureType": "poi",
	    "elementType": "geometry",
	    "stylers": [
	      { "color": "#9d4b76" }
	    ]
	  },{
	    "featureType": "road",
	    "elementType": "geometry",
	    "stylers": [
	      { "color": "#fefefe" }
	    ]
	  },{
	    "featureType": "landscape.man_made",
	    "stylers": [
	      { "color": "#bc3895" }
	    ]
	  },{
	    "featureType": "landscape.natural",
	    "stylers": [
	      { "color": "#ee79c8" },
	      { "lightness": -67 }
	    ]
	  },{
	    "featureType": "poi.business",
	    "elementType": "geometry.fill",
	    "stylers": [
	      { "lightness": -48 },
	      { "color": "#911f1e" }
	    ]
	  },{
	    "featureType": "poi.park",
	    "elementType": "geometry.fill",
	    "stylers": [
	      { "color": "#93c50b" }
	    ]
	  },{
	    "featureType": "transit.line",
	    "stylers": [
	      { "visibility": "on" },
	      { "lightness": 61 }
	    ]
	  },{
	    "featureType": "poi.school",
	    "elementType": "geometry",
	    "stylers": [
	      { "color": "#f1cc23" }
	    ]
	  },{
	    "featureType": "poi.attraction",
	    "elementType": "geometry",
	    "stylers": [
	      { "visibility": "on" },
	      { "color": "#93c50b" }
	    ]
	  },{
	    "featureType": "poi.government",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "poi.place_of_worship",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "poi.sports_complex",
	    "elementType": "geometry",
	    "stylers": [
	      { "visibility": "on" },
	      { "color": "#bb575b" }
	    ]
	  },{
	    "featureType": "poi.medical",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "water",
	    "stylers": [
	      { "color": "#479fcd" }
	    ]
	  },{
	    "elementType": "labels.text",
	    "stylers": [
	      { "visibility": "on" },
	      { "color": "#ffffff" }
	    ]
	  },{
	    "elementType": "labels.text.stroke",
	    "stylers": [
	      { "color": "#ee79c8" },
	      { "lightness": -81 }
	    ]
	  }
	]
};