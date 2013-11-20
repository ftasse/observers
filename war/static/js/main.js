var user = ko.observable(null);
var QueryString = getRequestParameters ();

var clientId = '907117162790.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/plus.me '; // https://www.googleapis.com/auth/devstorage.write_only


(function () {
  $.getScript("/js/vendor/bootbox.min.js", function(){});

	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client.js?onload=registerGoogleAPI'; //:plusone.js?onload=customSigninRender 
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}());

function registerGoogleAPI()
{
  console.log("Loaded Google api!");
  gapi.client.setApiKey("***REMOVED***");
  gapi.client.load('storage', 'v1beta1');
  gapi.client.load('plus', 'v1');
  $("#signinButton").on('click', function(e) { runOnceAuthenticated(); });
}

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
          immediate: true,
          scope: scopes
        };
        gapi.auth.authorize(options, function (token) {
          //alert("Token " + token["access_token"]);
          if (token != null && (token['access_token'] || token['code'])) {
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
          } else if (token != null && authResult['error']) {
              console.log('Sign-in state: ' + authResult['error']);

          }  else if (errorDiv != undefined && errorDiv != null) {
              var msg = "We were unable to sign you in: error from Google server. Please try again later";
              errorDiv.html("<div class='alert alert-danger'>"+msg +"</div>"); 
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

function insertObject(fileData) { // event.target.files[0]
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      var reader = new FileReader();
      reader.readAsBinaryString(fileData);
      reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
          'name': fileData.name,
          'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

        //Note: gapi.client.storage.objects.insert() can only insert
        //small objects (under 64k) so to support larger file sizes
        //we're using the generic HTTP request method gapi.client.request()
        var request = gapi.client.request({
          'path': '/upload/storage/v1beta2/b/' + BUCKET + '/o',
          'method': 'POST',
          'params': {'uploadType': 'multipart'},
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody});
          //Remove the current API result entry in the main-content div
          try{
            //Execute the insert object request
            executeRequest(request, 'insertObject');
            //Store the name of the inserted object
            object = fileData.name;        
          }
          catch(e) {
            alert('An error has occurred: ' + e.message);
       }
   }
}