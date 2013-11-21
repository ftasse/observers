
//Google map containing all topic report locations
//A graph showing report number through time
//A title and short description widget
//A sentiment visualizer: percentage of happy vs sad vs indifferent reports
//A list of 10 most used buzzwords (appears in > 10% of the reports)
// or a list of recent reports (scroll down to get more reports)


var topicSummary;

$.fn.max = function(selector) { 
    return Math.max.apply(null, this.map(function(index, el) { return selector.apply(el); }).get() ); 
}

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
	};
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

	self.recentReportsDisplaySelected = ko.observable(true);
	self.buzzwordsDisplaySelected = ko.observable();
	self.hasBuzzwords = ko.observable(false);

	self.numSmsShares = ko.observable(0);
	self.numReports = ko.observable(0);

	self.reportMethods = ko.observable();

	self.currentPageIndex = ko.observable(0);

	self.pageSize = ko.observable(5);
	self.maxNumDisplayPageIndices = ko.observable(5);

	self.maxPageIndex = ko.computed(function () {
	    return (Math.ceil(self.numReports() / self.pageSize())) - 1;
	}, this);

	self.displayedPageindicesCompute = ko.computed(function () {
		var maxPageId = self.maxPageIndex();
		var mid = Math.floor(self.maxNumDisplayPageIndices()/2);
		var mid2 = Math.ceil(self.maxNumDisplayPageIndices()/2);
		var pageIndices = [];
		if (self.currentPageIndex() > mid)
		{
			var minPg = self.currentPageIndex()-mid;
			var maxPg = Math.min(self.maxPageIndex() + 1, self.currentPageIndex()+mid2);
			minPg = minPg - (self.currentPageIndex()+mid2 - maxPg);

			for (var i=minPg; i<maxPg; i++) {
			  pageIndices.push(i);
			}
		} else
		{
			var len = Math.min(self.maxPageIndex()+1, self.maxNumDisplayPageIndices());
			for (var i=0; i<len; i++) {
			  pageIndices.push(i);
			}
			//console.log(self.maxPageIndex() + " " + self.maxNumDisplayPageIndices());
		}
	    return pageIndices;
	}, this);

	self.displayedPageindices = ko.observableArray(ko.utils.unwrapObservable(self.displayedPageindicesCompute));
    self.displayedPageindicesCompute.subscribe(function (newValue) { self.displayedPageindices(newValue); });

	self.data = ko.observable(null);
	self.map = null;

	self.userName = ko.computed(function() {
		if (user() === null) {
			return null;
		}
        else { 
        	return user().googleDisplayName;
        }
    }, this);

    self.userId = ko.computed(function() {
		if ( user() === null) { 
			return null;
		}
        else { 
        	return  user().id;
        }
    }, this);

    self.isAdmin = ko.computed(function() {
        return self.ownerUserId() == self.userId();
    }, this);

    self.isLoggedIn = ko.computed(function() {
        return (user() !== null);
    }, this);

    self.showOnMap = function(report) {
    	if (self.data() !== null && report.location !== undefined)
    	{
    		
			//google.visualization.events.trigger(this, 'select', mev);

    		var selectionArray = [];
	    	var foundRows = self.data().getFilteredRows([{column: 0, value: report.id}]);

	    	for (var y = 0, maxrows = foundRows.length; y < maxrows; y++) {
			     selectionArray.push({row: foundRows[y], column:null});
			}
			self.map.setSelection(selectionArray);

			/*var mev = {
			  stop: null,
			  latLng: new google.maps.LatLng(report.location.lat, report.location.lng)
			}
	    	console.log("Select report: " +  JSON.stringify(self.map.getSelection()));
	    	keys = Object.keys(self.map);
	    	console.log("Select report: " +  JSON.stringify(mev) + " " + keys);*/

    	}
    }

    self.goToPage = function(pageIndex) {

    	if (pageIndex < 0 || pageIndex > self.maxPageIndex())
    		return;

    	self.currentPageIndex(pageIndex);
    	//console.log(self.displayedPageindices());
    	jQuery('#reports-canvas').parent().showLoading();
			$.ajax({
					url: 'api/reports',
					type: 'GET',
					data: {
						topicId: topicSummary.id, 
						from:self.currentPageIndex()*self.pageSize(), 
						to: (self.currentPageIndex()+1)*self.pageSize()
					},
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: true,
					success: function(result) {
						topicSummary.reports(result)
					},
					complete: function() { jQuery('#reports-canvas').parent().hideLoading(); }
			});
	};

	self.goToPrevPage = function() {
		self.goToPage(self.currentPageIndex()-1);
	}

	self.goToNextPage = function() {
		self.goToPage(self.currentPageIndex()+1);
	}

	self.goToFirstPage = function() {
		self.goToPage(0);
	}

	self.goToLastPage = function() {
		self.goToPage(self.maxPageIndex());
	}

    self.reportHasMedia = function(report) {
    	if (report['mediaUrls'] == null || report['mediaUrls'] == undefined || report['mediaUrls'].length == 0)
    		return false;
    	return true;
    };

    self.removeReport = function(report) {
    	showConfirmDialog("Are you sure you want to delete this report? All the report details will be deleted from our server.",
                          function() {
                          	self.reports.remove(report) ;
					    	$.ajax({
					              url: 'api/reports?reportId='+report.id,
					              type: 'DELETE',
					              async: true,
					              success: function(result) {
					              	var msg = "The report posted on " + new Date (report.created) + " was successfully deleted."
					                $("#dashboardStatus").html("<div class='alert alert-success'>" + msg + "  </div>");
					              	//window.setTimeout(function() {$("#dashboardStatus").html(""); }, 2000);
					              },
					              error: function(XMLHttpRequest, textStatus, errorThrown) {
					                var msg = "An error occured: " + textStatus + ". Please try again later";
					                $("#dashboardStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
					                console.log("some error occured: ", errorThrown);
					              }
					            });
                          });
        };

    self.showMedia = function(report) { 
    	for (var i in report.mediaUrls)
    	{
    		media = report.mediaUrls[i];
    		openInNewTab(media);
    		return;
    	}	
    };

    self.facebookShareUrl = function() {
    	var link = "http://www.facebook.com/sharer/sharer.php?s=100&p[url]=" + window.location ;
    	link += "&p[images][0]=" + "&p[title]=" + self.title() + "&p[summary]=" + self.shortDescription();
    	return link;
    };

    self.googleplusShareUrl = function() {
    	var link = "https://plus.google.com/share?url=" + window.location ;
    	return link;
    };

    self.shareWithSMS = function() {
    	alert("Coming soon!");
    }

	//Behaviour
	/*self.goToRecentReports = function() {
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
    }).run();*/
}

function initializeTopicSummary()
{
	topicSummary = new dashboardViewModel();
	ko.applyBindings(topicSummary);

	if (user() === null) {
		getUser();
	}

	topicSummary.id(QueryString.topicId);

	if (topicSummary.id() === null)
	{
		console.log("A topic id was not specified in the query");
	} else
	{
		topicSummary.url(location.protocol + '//' + location.host + "/dashboard.html?topicId=" + topicSummary.id);
	}

		jQuery('#summary-canvas').showLoading();
		$.ajax({
              url: 'api/topics',
              type: 'GET',
              data: {topicId: topicSummary.id()},
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(topic) {
                topicSummary.title(topic.title);
				topicSummary.shortDescription(topic.shortDescription);
				topicSummary.supportsSms(topic.supportsSms);
				topicSummary.ownerUserId(topic.ownerUserId);
				topicSummary.numSmsShares(topic.numSmsShares);
				topicSummary.numReports(topic.numReports);

				$.ajax({
		              url: 'api/channels?topicId='+topicSummary.id(),
		              type: 'GET',
		              async: false,
		              success: function(jsonData) {
		              	var msg = ""
		                for (var i in jsonData)
		                {
		                	var channelData = jsonData[i];
					        if (channelData.source == "None") {
					          msg += "<li>" + "Using the form below" + "</li>\n"
					        } else if (channelData.source == "Twitter") {
					          msg += "<li>" + "Tweeting by mentionning " + channelData.account.name + " and using the hashtag " + channelData.account.hashtag + "</li>\n"
					        } else if (channelData.source == "Twilio" && channelData.account.hashtag != "") {
					          msg += "<li>" + "Sending an SMS ending with " + channelData.account.hashtag + " to the phone number: " + channelData.account.phoneNumbers[0] + "</li>\n"
					        }
		                }
		               	topicSummary.reportMethods( "You can submit a report via the following channels: " + "<ul>" + msg + "</ul>");
		              },
		              error: function(XMLHttpRequest, textStatus, errorThrown) {
		                console.log("some error occured: ", errorThrown);
		              }, 
		              complete: function() { }
			          });

				topicSummary.goToPage(0);

				google.load("visualization", "1", {packages:["corechart", "map", "annotatedtimeline"], callback: initializeCharts}); 
				
				//$('title').text(self.title());
				$('meta[name=description]').attr('content', self.shortDescription);
              },
              complete: function() { jQuery('#summary-canvas').hideLoading(); }
            });
		
		topicSummary.hasBuzzwords(false);
		location.hash = "recentreports";

	$('#share-story-link').on('click', function (e) {
	  e.defaultPrevented = true;
	  $( "#create-topic-modal" ).html("");
	  jQuery('#share-story-link').showLoading();

	   $("#share-story-modal" ).load("sharestory_form.html", function() {
	    jQuery('#share-story-link').hideLoading();

	    var sendReport = new SendReportModel(topicSummary.id());
	    sendReport.helpMessage(topicSummary.reportMethods());
	    //alert(ko.toJS(sendReport.opinionList));
	    ko.applyBindings(sendReport, document.getElementById("sharestory-dialog"));
	    $('#share-story-modal').modal( {backdrop:'static'} );
	  });
	});
}

function drawMapChart() {
	var geoView = new google.visualization.DataView(topicSummary.data());
    geoView.setColumns([1, 2, 3]);

      var options = {
      	showTip: true,
      	mapType: "normal",
      	//enableScrollWheel: true,
      	useMapTypeControl: true
      };

      topicSummary.map = new google.visualization.Map(document.getElementById('map-canvas'));
      topicSummary.map.draw(geoView, options);

	    function resizeHandler () {
	        topicSummary.map.draw(geoView, options);
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
        pieSliceTextStyle: {color: 'black'},
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

    jQuery('#sentiment-canvas').parent().parent().showLoading();
    jQuery('#map-canvas').parent().parent().showLoading();
    jQuery('#timeseries-canvas').parent().parent().showLoading();
    query.send(function(response) {
    	jQuery('#sentiment-canvas').parent().parent().hideLoading();
    	jQuery('#timeseries-canvas').parent().parent().hideLoading();
    	jQuery('#map-canvas').parent().parent().hideLoading();
      // Create our data table out of JSON data loaded from server.
      topicSummary.data(response.getDataTable());
        drawSentimentChart();
		drawTimeSeriesChart();
		drawMapChart();
       
       	/*$('.l-box').height(function () {
  			var maxHeight = $(this).closest('.dashboard.col-wrap').find('.l-box')
            .max( function () {
            	return $(this).height();
        	});
			return maxHeight;
		});*/
	});
}

var t;
function size(animate){
    // If we are resizing, we don't want the charts drawing on every resize event.
    // This clears the timeout so that we only run the sizing function
    // when we are done resizing the window
    /*clearTimeout(t);
    // This will reset the timeout right after clearing it.
    t = setTimeout(function(){
    	//redraw(animate);
    	$('.l-box').height(function () {
  			var maxHeight = $(this).closest('.row').find('.l-box')
            .max( function () {
            	return $(this).height();
        	});
			return maxHeight;
		});
    }, 400); // the timeout should run after 400 milliseconds*/
}

(function () {
	initializeTopicSummary();
	loadSocialScripts();
}) ();