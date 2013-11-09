
//Google map containing all topic report locations
//A graph showing report number through time
//A title and short description widget
//A sentiment visualizer: percentage of happy vs sad vs indifferent reports
//A list of 10 most used buzzwords (appears in > 10% of the reports)
// or a list of recent reports (scroll down to get more reports)

function reportLocation()
{
	return {
		reportId: 0,
		geolocation: {
			lat: 0,
			lng: 0
		}
	};
};

function reportTimePoint()
{
	return {
		time: 0,
		frequency: 0
	};
};

function buzzword()
{
	return {
		word: 0,
		frequency: 0
	}
}

var topicSummary = {
	locations: ko.observableArray([]),
	sentiment: ko.observable({
		happy: 0,
		sad: 0,
		indifferent: 0
	}),
	timeSeries: ko.observableArray([]),
	buzzwords: ko.observableArray([])
};
ko.applyBindings(topicSummary);

function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp";
  script.src += "&key=***REMOVED***&sensor=true";
  script.src += "&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;

