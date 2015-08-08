# Udacity ND001 Front-end web development
## P5: Neighborhood Map App

### Running instructions

Here are some useful tips to help run the app:

#### Desktop

Open index.html to get access to the app. All the features are loaded automatically from there. The app starts by initializing the map and a set of markers, displaying locations in the city of Karlsruhe, Germany which I would like to visit. Most of the usual Google Maps features were enabled (panning, zomming, etc.). For an overview of the apps main features have a look below.

#### Mobile

1. To inspect the site on a phone, download the repository and run a local server

  ```bash
  $> cd /path/to/project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080

### Features
* Full screen map that shows markers of five hard-coded venues.
* Additional markers can be created by clicking on the map.
* Markers can be clicked to open an info window with (if accesible) additional information on the location using the FourSquare and Google StreetView APIs.
* A marker list is displayed to keep an overview of all the markers. The list is designed so that it can be hidden on smaller resolution displays.
* The marker list can be searched to only display a set of filtered markers. The markers are shown/hidden on the map accordingly.
* Markers can be deleted by clicking the delete button on the marker list panel.
* A custom "Udacity"-style for the map was created. However I don't advise the prolonged use of this feature. ;)