
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

	self.user = ko.observable({googleDisplayName: null});

	self.userName = ko.computed(function() {
		if (self.user() == null)	return null;
        else return self.user().googleDisplayName;
    }, this);

    this.userId = ko.computed(function() {
		if (self.user() == null)	return null;
        else return self.user().id;
    }, this);

    this.isAdmin = ko.computed(function() {
        return self.ownerUserId() == self.userId();
    }, this);

    this.isLoggedIn = ko.computed(function() {
        return (self.user() != null);
    }, this);

    this.isNotLoggedIn = ko.computed(function() {
        return !self.isLoggedIn();
    }, this);

    this.data = null;

	//Behaviour
	self.goToRecentReports = function() {
		location.hash = "recentreports";
	}

	self.goToBuzzwords = function() {
		location.hash = "buzzwords";
	}

	self.getUser = function ()
	{
		$.get('/api/users')
	  .done(function(userJson) {
			self.user(userJson);
		})
	  .error(function () {
	  	self.user(null);
	  });
	}

	self.logout = function()
	{
		console.log("Logging out!");
		gapi.auth.signOut();
	}

	self.disconnect = function()
	{
		$.get('api/disconnect', function(data){ console.log(data)});
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

function signinCallback(authResult) {
  if (authResult['code']) {
    // Send the code to the server
    $.get('api/oauth2callback', { code: authResult['code'], state: authResult['state'] }, function(result) {
        //console.log(result);
		topicSummary.user(result);
      });
  } else if (authResult['error']) {
    	console.log('Sign-in state: ' + authResult['error']);
    	if (authResult['error'] == "user_signed_out")
    	{
			topicSummary.user(null);
			$.get('api/logout', function(data){ 
				console.log(data);
				topicSummary.user(null);
			});
		}
  }
}

function loadSigninAPI() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}


function render() {
    gapi.signin.render('signinButton', {
    	'callback': 'signinCallback',
		'accesstype': 'offline',
		'redirecturi': 'postmessage',
		'clientid': '907117162790.apps.googleusercontent.com',
		'cookiepolicy': 'single_host_origin',
		'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me'
	});
}

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

	topicSummary.getUser();

	$.get('/api/topics', {topicId: topicSummary.id()})
	  .done(function(topic) {
			topicSummary.title(topic.title);
			topicSummary.shortDescription(topic.shortDescription);
			topicSummary.supportsSms(topic.supportsSms);
			topicSummary.ownerUserId(topic.ownerUserId);
			topicSummary.numSmsShares(topic.numSmsShares);
			google.load("visualization", "1", {packages:["corechart", "map", "annotatedtimeline"], callback: initializeCharts}); 
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
	topicSummary.hasBuzzwords(false);
	location.hash = "recentreports";

	$.get('/api/reports', {topicId: topicSummary.id, from:0, to:5}, topicSummary.reports);
}

function drawMapChart() {
	var geoView = new google.visualization.DataView(topicSummary.data);
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

function drawSentimentChart() {

	var sentimentView = new google.visualization.data.group(topicSummary.data, [5], 
		[{'column': 5, 'aggregation': google.visualization.data.count, 'type': 'number', 'label' : "Number of reports"}]);

	var options = {
		title: 'Emotion analysis',
		pieHole: 0.4,
	};

	var chart = new google.visualization.PieChart(document.getElementById('sentiment-canvas'));
	chart.draw(sentimentView, options);
}

function drawTimeSeriesChart() {

	var frequencyView = new google.visualization.data.group(topicSummary.data, [4], 
		[{'column': 4, 'aggregation': google.visualization.data.count, 'type': 'number', 'label': 'Reports per day'}]);

	/*var options = {
		displayAnnotations: true,
		wmode: 'transparent',

		chartArea:{left:20,top:5,width:"75%",height:"80%"},
		legend: {position: 'in', textStyle: {color: 'blue', fontSize: 16}},

		// Allow multiple simultaneous selections.
    selectionMode: 'multiple',
    // Trigger tooltips on selections.
    tooltip: { trigger: 'selection' },
    // Group selections by x-value.
    aggregationTarget: 'category'

	};

	var chart = new google.visualization.LineChart(document.getElementById('timeseries-canvas'));
	chart.draw(frequencyView, options);*/

	g = new Dygraph(
		document.getElementById("timeseries-canvas"),
		function() {
			return frequencyView;
		},
		{
			strokeWidth: 2,
			'Reports per day': {
				strokeWidth: 1.0,
				drawPoints: true,
				pointSize: 1.5
			}
		}
		);
}

function initializeCharts()
{
	var query = new google.visualization.Query('/api/topics/analysis?topicId='+topicSummary.id());
    //query.setQuery('select reportId, latitude, longitude, content');
    query.send(function(response) {
      // Create our data table out of JSON data loaded from server.
      topicSummary.data = response.getDataTable();
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
    	redraw(animate);
    	$(".pure-g-r").each(function(i,el){
    		var contentPieces = $(el).find(".dashboard-piece");
    		var max = 0;
    		contentPieces.css("min-height","");
    		$.grep(contentPieces, function(el,i){
    			max = Math.max($(el).outerHeight(),max);
    		});
    		contentPieces.css("min-height", max);
    	});
    }, 400); // the timeout should run after 400 milliseconds
}
$(window).on('resize', size);

function redraw(animation){
    var options = {};
    if (!animation){
        options.animation = false;
    } else {
        options.animation = true;
    }
    
	drawSentimentChart();
	drawTimeSeriesChart();
	drawMapChart();
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
	loadSigninAPI();
	loadFacebookScript(document, 'script', 'facebook-jssdk');
	loadGooglePlusScript();
	!loadTwitterScript(document, 'script', 'twitter-wjs');
}

YUI({
	classNamePrefix: 'pure'
}).use('gallery-sm-menu', function (Y) {

	var horizontalMenu = new Y.Menu({
		container         : '#horizontal-menu',
		sourceNode        : '#std-menu-items',
		orientation       : 'horizontal',
		hideOnOutsideClick: false,
		hideOnClick       : false
	});

	horizontalMenu.render();
	horizontalMenu.show();
});

window.onload = loadScripts;