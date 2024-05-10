var currentInfoWindow;
var markers = []; // Array to store markers

function createMarkerAndInfoWindow(coordinate, map) {
  console.log("Creating marker for:", coordinate);
  
  // Debugging: Log the club and stadium data
  console.log("Club:", coordinate.Club);
  console.log("Stadium:", coordinate.Stadium);

  var marker = new google.maps.Marker({
      map: map,
      position: {
          lat: parseFloat(coordinate.Latitude),
          lng: parseFloat(coordinate.Longitude)
      },
      icon: {
          url: 'map_pin.png', // Path to your PNG image
          scaledSize: new google.maps.Size(25, 25) // Adjust the size of the marker icon as needed
      }
  });

  // Ensure Club and Stadium information is available and not undefined
  var club = coordinate.Club || 'No club info';
  var stadium = coordinate.Stadium || 'No stadium info';

  // Building the content string for the InfoWindow
  var infoWindowContent = `<div style="color: black;"><strong>Club:</strong> ${club}<br><strong>Stadium:</strong> ${stadium}</div>`;
  console.log("InfoWindow content:", infoWindowContent); // Log the content
  var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
  });

  marker.addListener("click", function () {
      if (currentInfoWindow) {
          currentInfoWindow.close();
      }
      currentInfoWindow = infoWindow;

      // Log the info window content just before opening
      console.log("InfoWindow content:", infoWindowContent);

      // Open the info window
      infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function geocodeCoordinates(map, coordinates) {
    // Clear all existing markers before adding new ones
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    coordinates.forEach(function (coordinate) {
        createMarkerAndInfoWindow(coordinate, map);
    });
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: { lat: 52.736120662634704, lng: -1.2802434145946422 }
  });

  // Ensure marker creation and info window opening only happen after the map is fully loaded
  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
      loadCoordinatesFromCSV(map);
  });
}

function loadCoordinatesFromCSV(map) {
    var csvFileUrl = "https://pl-stadiums.s3.eu-west-2.amazonaws.com/PL_Stadiums.csv";
    fetch(csvFileUrl)
        .then(response => response.text())
        .then(data => {
            var coordinates = parseCSV(data);
            geocodeCoordinates(map, coordinates);
        })
        .catch(error => {
            console.error("Failed to load CSV file:", error);
        });
}

function parseCSV(text) {
  const lines = text.split("\n");
  const headers = lines[0].split(",").map(header => header.trim().replace(/"/g, ""));
  console.log("Headers:", headers);
  const data = lines.slice(1).map((line, index) => {
      const values = line.split(",").map(value => value.trim().replace(/"/g, ""));
      if (values.length === 1 && values[0] === "") return null; // Skip empty lines
      const coordinate = {};
      headers.forEach((header, index) => {
          const trimmedValue = values[index] ? values[index].trim() : '';
          const headerKey = header.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
          if (headerKey === "Latitude" || headerKey === "Longitude" || headerKey === "Club" || headerKey === "Stadium") {
              coordinate[headerKey] = trimmedValue;
          }
          console.log(`Header: ${header}, Value: ${coordinate[headerKey]}`); // Log each header and value for debugging
      });
      return coordinate;
  }).filter(coordinate => coordinate && coordinate.Latitude !== undefined && coordinate.Longitude !== undefined);
  console.log("Filtered coordinates:", data); // Log filtered coordinates to verify correct parsing
  return data;
}

// Assign the initMap function to the window object to make it globally accessible
window.initMap = initMap;