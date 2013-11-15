var user = ko.observable(null);

(function () {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=customSigninRender'; 
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    console.log("Loaded G+ api!");
})();

function getUser ()
{
	$.get('/api/users')
	.done(function(userJson) {
		user(userJson);
	})
	.error(function () {
		user(null);
	});
}

function userLogout()
{
	console.log("Logging out!");
	if (user() != null)
	{
		$.get('api/logout', function(data){ 
			user(null);
		}).error(function() {
			console.log("Could not log out");
		});
	}
	gapi.auth.signOut();
}

function userDisconnect()
{
	$.get('api/disconnect', function(data){ console.log(data)});
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
    	{if (user() != null)
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

function customSigninRender() {
    gapi.signin.render('signinButton', {
    	'callback': 'signinCallback',
		'accesstype': 'offline',
		'redirecturi': 'postmessage',
		'clientid': '907117162790.apps.googleusercontent.com',
		'cookiepolicy': 'single_host_origin',
		'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me'
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
};


