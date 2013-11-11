
//Google map containing all topic report locations
//A graph showing report number through time
//A title and short description widget
//A sentiment visualizer: percentage of happy vs sad vs indifferent reports
//A list of 10 most used buzzwords (appears in > 10% of the reports)
// or a list of recent reports (scroll down to get more reports)

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

function buzzword()
{
	return {
		word: "word",
		frequency: 0
	}
}

function dashboardViewModel() {
	//Data
	var self = this;
	self.id = ko.observable();
	self.title = ko.observable();
	self.shortDescription = ko.observable();
	self.supportsSms = ko.observable();
	self.url = ko.observable();

	self.reportLocations =  ko.observableArray();
	self.reportTrend = ko.observable();
	self.sentiment = ko.observable();
	self.buzzwords = ko.observableArray();
	self.reports = ko.observableArray();

	self.recentReportsDisplaySelected = ko.observable();
	self.buzzwordsDisplaySelected = ko.observable();
	self.hasBuzzwords = ko.observable(false);

	//Behaviour
	self.goToRecentReports = function() {
		location.hash = "recentreports";
	}

	self.goToBuzzwords = function() {
		location.hash = "buzzwords";
	}

	//Client-side routes
	Sammy(function() {
        this.get('#recentreports', function() {
            self.recentReportsDisplaySelected(true);
			self.buzzwordsDisplaySelected(false);
        });

        this.get('#buzzwords', function() {
            self.recentReportsDisplaySelected(false);
			self.buzzwordsDisplaySelected(true);
        });

        this.get('', function() { this.app.runRoute('get', '#buzzwords') });
    }).run();
};

topicSummary = new dashboardViewModel();
ko.applyBindings(topicSummary);

function initializeTopicSummary()
{
	topicSummary.id(QueryString.topicId);

	if (topicSummary.id() == null)
	{
		console.log("A topic id was not specified in the query");
	} else
		topicSummary.url(location.protocol + '//' + location.host + "/dashboard.html?topicId=" + topicSummary.id);

	$.get('/api/topics', {topicId: topicSummary.id()})
	  .done(function(topic) {
			topicSummary.title(topic.title);
			topicSummary.shortDescription(topic.shortDescription);
			topicSummary.supportsSms(topic.supportsSms);
		});

	/*$.get('/api/topics/buzzwords', {topicId: topicSummary.id()})
	   .done( function(data) {
			topicSummary.buzzwords([ new buzzword (), new buzzword ()]);
		})
	   .always( function() {
	   		if (topicSummary.buzzwords() != null && topicSummary.buzzwords().length > 0)
	   			topicSummary.hasBuzzwords(true);
	   		else {
	   			topicSummary.hasBuzzwords(false);
	   			location.hash = "recentreports";
	   		}
	   });*/


	$.get('/api/reports', {topicId: topicSummary.id}, topicSummary.reports);
}

function initializeMapChart(data) {
	var geoView = new google.visualization.DataView(data);
    geoView.setColumns([1, 2, 3]);

      var options = {
      	showTip: true,
      	mapType: "normal",
      	//enableScrollWheel: true,
      	useMapTypeControl: true
      }

      var map = new google.visualization.Map(document.getElementById('map-canvas'));
      map.draw(geoView, options);
  }

function initializeSentimentChart(data) {

	var sentimentView = new google.visualization.data.group(data, [5], 
		[{'column': 5, 'aggregation': google.visualization.data.count, 'type': 'number', 'label' : "Number of reports"}]);

	var options = {
		title: 'Emotion analysis',
		pieHole: 0.4,
	};

	var chart = new google.visualization.PieChart(document.getElementById('sentiment-canvas'));
	chart.draw(sentimentView, options);
}

function initializeTimeSeriesChart(data) {

	var frequencyView = new google.visualization.data.group(data, [4], 
		[{'column': 4, 'aggregation': google.visualization.data.count, 'type': 'number', 'label': 'Posted reports'}]);

	var options = {
		displayAnnotations: true
	};

	var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('timeseries-canvas'));
	chart.draw(frequencyView, options);
}

function initializeCharts()
{
	var query = new google.visualization.Query('/api/topics/analysis?topicId='+topicSummary.id());
    //query.setQuery('select reportId, latitude, longitude, content');
    query.send(function(response) {
      // Create our data table out of JSON data loaded from server.
      var data = response.getDataTable();
	  initializeSentimentChart(data);
	  initializeTimeSeriesChart(data);
	  initializeMapChart(data);
	});
}

function loadFacebookScript(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=247255338763582";
		fjs.parentNode.insertBefore(js, fjs);
}


function loadGooglePlusScript() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/plusone.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}

function loadTwitterScript(d,s,id){
	var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
	if(!d.getElementById(id)) {
		js=d.createElement(s);
		js.id=id;
		js.src=p+'://platform.twitter.com/widgets.js';
		fjs.parentNode.insertBefore(js,fjs);
	}
}

function loadScripts() {
	initializeTopicSummary();

	loadFacebookScript(document, 'script', 'facebook-jssdk');
	loadGooglePlusScript();
	!loadTwitterScript(document, 'script', 'twitter-wjs');
	
	google.load("visualization", "1", {packages:["corechart", "map", "annotatedtimeline"], callback: initializeCharts}); 
}

window.onload = loadScripts;