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
	$.post('api/disconnect', function(data){ console.log(data)});
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
		'scope': 'https://www.googleapis.com/auth/plus.login'
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

function createEditTopic () {
    this.title = ko.observable("Elections au Cameroun");
    this.shortDescription = ko.observable("Suivi des elections municipales");
    this.id = ko.observable();

    this.channels = ko.observableArray([]);

    this.channelTypes = ["Web forms", "Tweets", "SmS"];
    this.channelTypeTips = ["Users can submit their reports from the topic dashboard", 
                "Users can submit their reports via tweets", 
                "Users can submit their reports via sms"];
    this.chosenChannelType = ko.observable(this.channelTypes[1]);

    this.channelTypeTip = ko.computed(function() {
          return this.channelTypeTips[this.channelTypes.indexOf(this.chosenChannelType())];
      }, this);

      this.alertText = ko.computed(function() {
        if (user()) return "";
        else return "Note that to save this topic, you will be asked to login.";
      }, this);


    this.addWebChannel = function () {
      this.channels.push({
        type: "Web", 
        id: null
      });
    };

    this.addTwitterChannel = function (username, hashtag) {
      this.channels.add( {
        type: "Twitter",
        username: username,
        hashtag: hashtag,
        id: null
      });
    };

    this.addTwilioChannel  = function(accountId, authToken, phoneNumber) {
      this.channels.add ( {
        type: "Twilio",
        accountId: accountId,
        authToken: authToken,
        phoneNumber: phoneNumber,
        id: null
      });
    };

    this.populateFromJsonData = function (jsonData) {

    };

    this.saveChanges = function () {

    };

    this.addWebChannel();
}

$('#create-topic-link').on('click', function (e) {
  e.defaultPrevented = true;
  $( "#create-topic-modal" ).load( "createtopic_form.html", function() {
    var editTopic = createEditTopic();
    ko.applyBindings(editTopic, document.getElementById("createtopic-dialog"));
    $('#create-topic-modal').modal();
  });

});