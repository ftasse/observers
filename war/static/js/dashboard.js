
//Google map containing all topic report locations
//A graph showing report number through time
//A title and short description widget
//A sentiment visualizer: percentage of happy vs sad vs indifferent reports
//A list of 10 most used buzzwords (appears in > 10% of the reports)
// or a list of recent reports (scroll down to get more reports)


var QueryString = getRequestParameters ();
var topicSummary;

/*function showCreateTopic () {
	var url = "/createtopic_form.html";
	$("#createTopicModal").load(url, function() { // load the url into the modal
            $(this).modal('show'); // display the modal on url load
        });
}*/

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
	self.ownerUserId = ko.observable();

	self.reportLocations =  ko.observableArray();
	self.reportTrend = ko.observable();
	self.sentiment = ko.observable();
	self.buzzwords = ko.observableArray();
	self.reports = ko.observableArray();

	self.recentReportsDisplaySelected = ko.observable();
	self.buzzwordsDisplaySelected = ko.observable();
	self.hasBuzzwords = ko.observable(false);

	self.numSmsShares = ko.observable();

	self.data = ko.observable(null);

	self.userName = ko.computed(function() {
		if (user() == null)	return null;
        else return user().googleDisplayName;
    }, this);

    self.userId = ko.computed(function() {
		if ( user() == null)	return null;
        else return  user().id;
    }, this);

    self.isAdmin = ko.computed(function() {
        return self.ownerUserId() == self.userId();
    }, this);

    self.isLoggedIn = ko.computed(function() {
        return (user() != null);
    }, this);

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

function initializeTopicSummary()
{
	topicSummary = new dashboardViewModel();
	ko.applyBindings(topicSummary);

	if (user() == null) 
		getUser();

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
			topicSummary.ownerUserId(topic.ownerUserId);
			topicSummary.numSmsShares(topic.numSmsShares);
			google.load("visualization", "1", {packages:["corechart", "map", "annotatedtimeline"], callback: initializeCharts}); 
		});

	topicSummary.hasBuzzwords(false);
	location.hash = "recentreports";

	$.get('/api/reports', {topicId: topicSummary.id, from:0, to:5}, topicSummary.reports);
}

function drawMapChart() {
	var geoView = new google.visualization.DataView(topicSummary.data());
    geoView.setColumns([1, 2, 3]);

      var options = {
      	showTip: true,
      	mapType: "normal",
      	//enableScrollWheel: true,
      	useMapTypeControl: true
      }

      var map = new google.visualization.Map(document.getElementById('map-canvas'));
      map.draw(geoView, options);

	    function resizeHandler () {
	        map.draw(geoView, options);
	    }
	    if (window.addEventListener) {
	        window.addEventListener('resize', resizeHandler, false);
	    }
	    else if (window.attachEvent) {
	        window.attachEvent('onresize', resizeHandler);
	    }
  }

function drawSentimentChart() {

	var sentimentView = new google.visualization.data.group(topicSummary.data(), [5], 
		[{'column': 5, 'aggregation': google.visualization.data.count, 'type': 'number', 'label' : "Number of reports"}]);

	var options = {
		legend: 'none',
        pieSliceText: 'label',
		pieHole: 0.4,
		colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
		backgroundColor: {
			fill: 'transparent'
		}
	};

	var chart = new google.visualization.PieChart(document.getElementById('sentiment-canvas'));
	chart.draw(sentimentView, options);

	function resizeHandler () {
	        chart.draw(sentimentView, options);
	    }
	    if (window.addEventListener) {
	        window.addEventListener('resize', resizeHandler, false);
	    }
	    else if (window.attachEvent) {
	        window.attachEvent('onresize', resizeHandler);
	    }
}

function drawTimeSeriesChart() {

	var frequencyView = new google.visualization.data.group(topicSummary.data(), [4], 
		[{'column': 4, 'aggregation': google.visualization.data.count, 'type': 'number', 'label': 'Reports per day'}]);

	var options = {
		legend: 'none', 
		backgroundColor:{
			fill: 'transparent'
		}/*,
		hAxis: { gridlines: {color: 'red', count: 0} },
		vAxis: { gridlines: {color: 'black'} }*/
	};

	var chart = new google.visualization.LineChart(document.getElementById('timeseries-canvas'));
	chart.draw(frequencyView, options);

	function resizeHandler () {
	        chart.draw(frequencyView, options);
	    }
	    if (window.addEventListener) {
	        window.addEventListener('resize', resizeHandler, false);
	    }
	    else if (window.attachEvent) {
	        window.attachEvent('onresize', resizeHandler);
	    }

	/*var options = {
			title: "Reports per day",
			width: $('#timeseries-canvas').width(),
			strokeWidth: 2,
			'Reports per day': {
				strokeWidth: 1.0,
				drawPoints: true,
				pointSize: 1.5
			}
		}

	g = new Dygraph(
		document.getElementById("timeseries-canvas"),
		function() {
			return frequencyView;
		},
		options
		);

	function timeseriesResizeHandler () {
			options.width = $('#timeseries-canvas').width();
			console.log("redraw!!! " + options.width);
	        g.updateOptions(options);
	    }
	if (window.addEventListener) {
	    window.addEventListener('resize', timeseriesResizeHandler, false);
	}
	else if (window.attachEvent) {
	    window.attachEvent('onresize', timeseriesResizeHandler);
	}*/
}

/*function redraw(animation){
    var options = {};
    if (!animation){
        options.animation = false;
    } else {
        options.animation = true;
    }
    
	drawSentimentChart();
	drawTimeSeriesChart();
	drawMapChart();
}*/

function initializeCharts()
{
	var query = new google.visualization.Query('/api/topics/analysis?topicId='+topicSummary.id());
    //query.setQuery('select reportId, latitude, longitude, content');
    query.send(function(response) {
      // Create our data table out of JSON data loaded from server.
      topicSummary.data(response.getDataTable());
        drawSentimentChart();
		drawTimeSeriesChart();
		drawMapChart();
       size();
	});
}

var t;
function size(animate){
    // If we are resizing, we don't want the charts drawing on every resize event.
    // This clears the timeout so that we only run the sizing function
    // when we are done resizing the window
    clearTimeout(t);
    // This will reset the timeout right after clearing it.
    t = setTimeout(function(){
    	//redraw(animate);
    	$(".row").each(function(i,el){
    		var contentPieces = $(el).find(".dashboard-piece");
    		var max = 0;
    		contentPieces.css("min-height","");
    		$.grep(contentPieces, function(el,i){
    			max = Math.max($(el).outerHeight(),max);
    		});
    		contentPieces.css("min-height", max);
    	});
    	$(".row").each(function(i,el){
    		var contentPieces = $(el).find(".l-box");
    		var max = 0;
    		contentPieces.css("min-height","");
    		$.grep(contentPieces, function(el,i){
    			max = Math.max($(el).outerHeight(),max);
    		});
    		contentPieces.css("min-height", max);
    	});
    }, 400); // the timeout should run after 400 milliseconds
}

(function () {
	initializeTopicSummary();
	loadSocialScripts();
})();