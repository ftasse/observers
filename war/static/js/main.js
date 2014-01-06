var user = ko.observable(null);
var QueryString = getRequestParameters ();
var auth_callback = null;
var first_try_login = true;

var clientId = '907117162790.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/devstorage.read_write'; //

  (function () {
    "use strict";
    $.getScript("/js/vendor/bootbox.min.js", function(){});

  	var po = document.createElement('script'); 
    po.type = 'text/javascript'; 
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=registerGoogleAPI';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  } ());

    /**
     * Handle authorization.
     */
    function handleAuthResult(token) {
      if (token !== null && (token['access_token'] || token['code'])) {
            var jsonData = null;
            if (token['code'])
              jsonData = JSON.stringify({code: token['code'], state: token['state']});
            else if (token['access_token'])
              jsonData = JSON.stringify({access_token: token['access_token']});
            else 
              jsonData = JSON.stringify(token);
            //console.log("Token: "  + jsonData);

            $.ajax({
              url: 'api/oauth2callback',
              type: 'POST',
              data: jsonData,
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              beforeSend: function() {
                //jQuery("#signinButton").showLoading();
              },
              success: function(result) {
                user(result);
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                user(null);
                console.log("some error occured: ", errorThrown);
              },
              complete: function() {
                //jQuery("#signinButton").hideLoading();
              }
            });
          } else if (token !== null && token['error']) {
              console.log('Sign-in state: ' + token['error']);
              //gapi.auth.checkSessionState({client_id: clientId, session_state:null}, function(status) {
              //  if (status === false)
                  if  (token['error'] != 'immediate_failed' || !first_try_login) 
                    user(null);
                  first_try_login = false;
              //});
            try {
              jQuery("#signinButton").hideLoading();
            } catch (err){
              console.log("catched error: " + err);
            }
          }  else {
              console.log("Token: ", token);
              user(null);
              jQuery("#signinButton").hideLoading();
          }

    }

    function googleSigninRender(elt_id)
    {
      gapi.signin.render(elt_id, {
      'callback': 'handleAuthResult',
      'clientid': clientId,
      'cookiepolicy': 'single_host_origin',
      'scope': scopes,
      'redirecturi':"postmessage",
      'accesstype': "offline"
      });
    }

    function signInMessage(divEl) {
      divEl.html("<div class='alert alert-info'>Please sign in to proceed. <button type='button' id='signinButtonExtra'> Sign in </button> </div>");
      googleSigninRender("signinButtonExtra");
    }

function registerGoogleAPI()
{
  console.log("Loaded Google api!");
  gapi.client.setApiKey("***REMOVED***");
  gapi.client.load('storage', 'v1beta1');
  //gapi.client.load('plus', 'v1');
  //$("#signinButton").on('click', function(e) { checkAuth(); });

  getUser(function() {
    googleSigninRender("signinButton");
  });
}

function showConfirmDialog(text, ok_callback, cancel_callback)
{
  bootbox.confirm(text, function(result) {
    if (result == true) ok_callback();
  }); 
}

function showMoreInfo() {
    /*jQuery(".container").showLoading();
    $.get( "/info.html", function( data ) {
      jQuery(".container").hideLoading();
      $( ".result" ).html( data );
      bootbox.alert(data);
    });*/

    jQuery(".container").showLoading();
    $("#more-info-modal" ).load( "info.html", function() {
      jQuery('.container').hideLoading();
      $('#more-info-modal').modal( {backdrop:'static'} );
  });
}

function getUser (complete_callback) {
	$.get('/api/users').done(function(userJson) {
		user(userJson);
	}).error(function () {
		user(null);
	}).complete(complete_callback);
}

function hasValidUser() {
  if (user() == null)
    return false;
  if (user().googleExpiresAt < (new Date()).getTime())
    return false;
  return true;
}

function userLogout(complete_callback)
{
	console.log("Logging out!");
	if (user() !== null)
	{
		$.get('api/logout', function(data) { 
      gapi.auth.signOut();
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
                    gapi.auth.signOut();
                    $.post('api/disconnect', function(data){ console.log(data); user(null); }).complete(complete_callback)
                   });
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

function openInNewTab(url )
{
  var win=window.open(url, '_blank');
  win.focus();
}