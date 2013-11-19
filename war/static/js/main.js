var user = ko.observable(null);
var QueryString = getRequestParameters ();


var clientId = '907117162790.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/plus.me';


(function () {
  $.getScript("/js/vendor/bootbox.min.js", function(){});

	/*var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=customSigninRender'; 
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    console.log("Loaded G+ api!");*/

    $.getScript("https://apis.google.com/js/client:plusone.js", function() { 
          console.log('Login api loaded.'); 
          //gapi.client.setApiKey("***REMOVED***");
          $("#signinButton").on('click', function(e) {
            runOnceAuthenticated();
          });
    });
}());

function showConfirmDialog(text, ok_callback, cancel_callback)
{
  bootbox.confirm(text, function(result) {
    if (result == true) ok_callback();
  }); 
} 

function getUser (complete_callback) {
	$.get('/api/users').done(function(userJson) {
		user(userJson);
	}).error(function () {
		user(null);
	}).complete(complete_callback);
}

function userLogout(complete_callback)
{
	console.log("Logging out!");
	if (user() !== null)
	{
		$.get('api/logout', function(data) { 
			user(null);
		}).error(function() {
			console.log("Could not log out");
		}).complete(complete_callback);
	}
	gapi.auth.signOut();
}

function userDisconnect(complete_callback)
{
  showConfirmDialog("Are you sure you want to delete your account? All your data will be deleted from our server. ",
	                 function(){
                    $.post('api/disconnect', function(data){ console.log(data); user(null); }).complete(complete_callback)
                   });
}

function runOnceAuthenticated(callback, errorDiv) {
  if (user()) {
    callback();
  }
  else {
    var options = {
          client_id: clientId,
          immediate: false,
          scope: scopes
        };
        gapi.auth.authorize(options, function (token) {
          //alert("Token " + token["access_token"]);
          if (token['access_token']) {
            $.ajax({
              url: 'api/oauth2callback',
              type: 'POST',
              data: JSON.stringify(token),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: false,
              success: function(result) {
                user(result);
                if (callback != undefined)
                  callback();
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (errorDiv != undefined && errorDiv != null)
                {
                  var msg = "We were unable to sign you in: " + textStatus + ". Please try again later";
                  errorDiv.html("<div class='alert alert-danger'>"+msg +"</div>");
                }
                console.log("some error occured: ", errorThrown);
              }
            });
          } else if (authResult['error']) {
              console.log('Sign-in state: ' + authResult['error']);
          } 
        });
  }
}

function getRequestParameters() {
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
}

$('#create-topic-link').on('click', function (e) {
  e.defaultPrevented = true;
  jQuery('.container').showLoading();
  
  $( "#create-topic-modal" ).load( "createtopic_form.html", function() {
    jQuery('.container').hideLoading();

    var editTopic = new EditTopicModel();
    editTopic.id(null);
    ko.applyBindings(editTopic, document.getElementById("createtopic-dialog"));
    $('#create-topic-modal').modal( {backdrop:'static'} );
  });
});

$('#edit-topic-link').on('click', function (e) {
  e.defaultPrevented = true;
  jQuery('.container').showLoading();

  $( "#create-topic-modal" ).load( "createtopic_form.html", function() {
    jQuery('.container').hideLoading();

    var editTopic = new EditTopicModel(QueryString.topicId);
    ko.applyBindings(editTopic, document.getElementById("createtopic-dialog"));
    $('#create-topic-modal').modal( {backdrop:'static'} );
  });
});

$('#share-story-link').on('click', function (e) {
  e.defaultPrevented = true;
  $( "#create-topic-modal" ).html("");
  jQuery('.container').showLoading();

   $("#share-story-modal" ).load("sharestory_form.html", function() {
    jQuery('.container').hideLoading();

    var sendReport = new SendReportModel(QueryString.topicId);
    //alert(ko.toJS(sendReport.opinionList));
    ko.applyBindings(sendReport, document.getElementById("sharestory-dialog"));
    $('#share-story-modal').modal( {backdrop:'static'} );
  });
});

function openInNewTab(url )
{
  var win=window.open(url, '_blank');
  win.focus();
}