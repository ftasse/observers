var user = ko.observable(null);
var QueryString = getRequestParameters ();

(function () {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=customSigninRender'; 
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    console.log("Loaded G+ api!");
}());

function getUser () {
	$.get('/api/users').done(function(userJson) {
		user(userJson);
	}).error(function () {
		user(null);
	});
}

function userLogout()
{
	console.log("Logging out!");
	if (user() !== null)
	{
		$.get('api/logout', function(data) { 
			user(null);
		}).error(function() {
			console.log("Could not log out");
		});
	}
	gapi.auth.signOut();
}

function userDisconnect()
{
	$.post('api/disconnect', function(data){ console.log(data); });
}

function signinCallback(authResult) {
  //console.log("Val: ", authResult["access_token"] + " "  + authResult["error"]);
  if (authResult['code']) {
    // Send the code to the server
    $.get('api/oauth2callback', { code: authResult['code'], state: authResult['state'] }, function(result) {
        //console.log(result);
		user(result);
      });
  } else if (authResult['error']) {
    	console.log('Sign-in state: ' + authResult['error']);
    	if (authResult['error'] == 'user_signed_out')
    	{if (user() !== null)
    		{
				$.get('api/logout', function(data){ 
					user(null);
				}).error(function() {
					console.log("Could not log out");
				});
			}
		}
  }
}

function runOnceAuthenticated(callback, errorDiv) {
  if (user()) {
    callback();
  }
  else {
    var options = {
          client_id: clientId,
          accesstype: 'offline',
          redirecturi: 'postmessage',
          cookiepolicy: 'single_host_origin',
          scope: scopes
        };
        gapi.client.setApiKey("***REMOVED***");
        gapi.auth.authorize(options, function (authResult) {
          var token = gapi.auth.getToken();
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
                callback();
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "We were unable to sign you in: " + textStatus + ". Please try again later";
                errorDiv.html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
          } else if (authResult['error']) {
              console.log('Sign-in state: ' + authResult['error']);
          } 
        });
  }
}

var clientId = '907117162790.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/plus.me';

function customSigninRender() {
    var options = {
    clientid: clientId,
    accesstype: 'offline',
    redirecturi: 'postmessage',
    cookiepolicy: 'single_host_origin',
    scope: scopes
   };
    options['callback'] = 'signinCallback';
    gapi.signin.render('signinButton', options);
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
  $( "#create-topic-modal" ).load( "createtopic_form.html", function() {
    $('#create-topic-modal').modal( {backdrop:'static'} );
  });

});