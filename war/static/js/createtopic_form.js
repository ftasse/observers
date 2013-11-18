var currentModel = null;

(function () {
    /*if (typeof user === 'undefined') {
      user = ko.observable();
    } else*/ if ( user() === null)
    {
      getUser();
    }

    $('#create-topic-submit').on('click', function(e){
      // We don't want self to act as a link so cancel the link action
      e.preventDefault();
      $('#createtopic-form').submit();
    });

    $('#createtopic-form').validate({
        debug: true,
        rules: {
            title: {
                minlength: 2,
                maxlength: 30,
                required: true
            },
            description: {
                minlength: 30,
                maxlength: 100,
                required: true
            },
            twitterName: {
              minlength: 2,
              required: {
                depends: function(element) {
                  return !$("#twitterHashtag:empty");
                }
              }
            },
            twitterHashtag: {
              minlength: 2,
              required: {
                depends: function(element) {
                  return !$("#twitterUsername:empty");
                }
              }
            },
            smsHashtag: {
              minlength: 2,
              required: false
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group')
                .removeClass('has-success').addClass('has-error');
            $(element).closest('.panel')
                .removeClass('panel-default').addClass('panel-danger');
        },
        success: function (element) {
            element.addClass('valid').closest('.form-group')
                .removeClass('has-error').addClass('has-success');
            $(element).closest('.panel')
                .removeClass('panel-danger').addClass('panel-default');
        },
        errorClass: "help-block",
        validClass: "help-block",
        submitHandler: function (form) {
            console.log("Submit");
            currentModel.saveChanges();
            return false; // ajax used, block the normal submit
        }
    });

}());

function EditTopicModel (topicId) {
    var self = this;
    currentModel = self;

    self.title = ko.observable();
    self.shortDescription = ko.observable();
    self.id = ko.observable();

    self.channels = ko.observableArray([]);

    ko.computed(function() {
        if (user() === null) {
          var msg = "To save this topic, we will ask you to login with your Google account.";
          $("#loginMessage").html("<div class='alert alert-warning'>" + msg + "</div>");
        }
        else {
          $("#loginMessage").html("");
        }
    }, self);

    self.mode = ko.computed(function() {
        if (self.id() !== null) {
          return "Edit Topic";
        }
        else {
          return "New Topic";
        }
      }, self);

    self.templateToUse = function(item) {
          return item.view;
      }.bind(self);

    self.createWebChannel = function (id) {
      return ({
        'type': "Web form", 
        'id': ko.observable(id),
        'attr': {href: "#web-form-channel", idt: "web-form-channel"},
        'view': "web-channel-template"
      });
    };

    self.createTwitterChannel = function (id, name, hashtag) {
      return ( {
        'type': "Twitter",
        'name': ko.observable(name),
        'hashtag': ko.observable(hashtag),
        'id': ko.observable(id),
        'attr': {href: "#twitter-channel", idt: "twitter-channel"},
        'view': "twitter-channel-template"
      });
    };

    self.createTwilioChannel  = function(id, phoneNumbers, hashtag) {
      return ({
        'type': "SMS",
        'hashtag': ko.observable(hashtag),
        'phoneNumbers': ko.observable(phoneNumbers),
        'id': ko.observable(id),
        'attr': {href: "#sms-channel", idt: "sms-channel"},
        'view': "sms-channel-template"
      });
    };

    self.populateTopicFromJson = function (jsonData) {
      self.title(jsonData.title);
      self.id(jsonData.id);
      self.shortDescription(jsonData.shortDescription);
    };

    self.populateChannelsFromJson = function(jsonData) {
      var newChannels = [];
      var hasWeb = false;
      var hasTwitter = false;
      var hasTwilio = false;

      for (var i in jsonData)
      {
        var channelData = jsonData[i];
        if (channelData.source == "None") {
          newChannels.push(self.createWebChannel(channelData.id));
          hasWeb = true;
        } else if (channelData.source == "Twitter") {
          newChannels.push(self.createTwitterChannel(channelData.id, channelData.account.name, channelData.account.hashtag));
          hasTwitter = true;
        } else if (channelData.source == "Twilio") {
          newChannels.push(self.createTwilioChannel(channelData.id, channelData.account.phoneNumbers, channelData.account.hashtag));
          hasTwilio = true;
        }
      }
      if (!hasWeb)
      {
        newChannels.push(self.createWebChannel());
      }
      if (!hasTwitter)
      {
        newChannels.push(self.createTwitterChannel());
      }
      if (!hasTwilio)
      {
        newChannels.push(self.createTwilioChannel());
      }
      self.channels(newChannels);
    };

   self.getTopicJsonData = function() {
      return {
          id: ko.toJS(self.id),
          title: ko.toJS(self.title),
          shortDescription: ko.toJS(self.shortDescription)
        };
    };

    self.getChannelsJsonData = function() {
      jsonChannelData = []
        for (var i in self.channels()) {
          var channel = self.channels()[i];
          var channelData = null;
          if (channel.type == "SMS")
          {
            channelData = {
              source: "Twilio", 
              id: ko.toJS(channel.id),
              account: { 
                hashtag:  channel.hashtag() || "" 
              } 
            };
          } else if (channel.type == "Twitter") {
             channelData = {
              source: "Twitter", 
              id: ko.toJSON(channel.id),
              account: { 
                name: channel.name() || "", 
                hashtag: channel.hashtag() || ""
              } 
            };
          } else if (channel.type == "Web form") {
            channelData = {
              source: "None", 
              id: ko.toJS(channel.id),
              account: {} 
            };
          }
          console.log(JSON.stringify(channelData));
          if (channelData !== null)
          {
            jsonChannelData.push(channelData);
          }
        }
        return jsonChannelData;
      };

    self.saveAuthenticatedChannels = function () {
      $.ajax({
              url: 'api/channels?topicId='+self.id(),
              type: 'POST',
              data: JSON.stringify(self.getChannelsJsonData()),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                self.populateChannelsFromJson(result);
                $("#successStatus").html("<div class='alert alert-success'> Successfully saved channels details. </div>");
                if (! /^\s*$/.test($("#twitterName").value)) self.refreshTweets();
                if (! /^\s*$/.test($("#smsHashtag").value)) self.refreshSMS();
                if (topicId == undefined && self.id() !== null)
                {
                  window.location.href = 'dashboard.html?topicId=' + self.id();
                }
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
    }

    self.saveAuthenticatedTopic = function() {
        //alert(JSON.stringify(getTopicJsonData()));
       // alert(JSON.stringify(getChannelsJsonData()));
        //$("#successStatus").html("<div class='alert alert-success'> Successfully saved topic details. </div>");
        //saveAuthenticatedChannels();
          $.ajax({
              url: 'api/topics',
              type: 'POST',
              data: JSON.stringify(self.getTopicJsonData()),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: false,
              success: function(result) {
                self.populateTopicFromJson(result);
                $("#successStatus").html("<div class='alert alert-success'> Successfully saved topic details. </div>");
                self.saveAuthenticatedChannels();
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
    }

    self.saveChanges = function () {
      //alert(JSON.stringify(ko.toJS(self.channels)));
      runOnceAuthenticated(function() {
        self.saveAuthenticatedTopic();
      }, $("#successStatus"));
    }

    self.refreshTweets = function() {
      function run () {
         $.ajax({
              url: 'api/twitter',
              type: 'GET',
              data: {topicId: self.id()},
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                $("#successStatus").html("<div class='alert alert-success'> Successfully fectched new tweets. </div>");
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
        }

      runOnceAuthenticated(function() {
        run();
      }, $("#successStatus"));
    }

    self.refreshSMS = function() {
        function run () {
         $.ajax({
              url: 'api/twilio',
              type: 'GET',
              data: {topicId: self.id()},
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                $("#successStatus").html("<div class='alert alert-success'> Successfully fetched outstanding SMS. </div>");
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
        }

        runOnceAuthenticated(function() {
          run();
        }, $("#successStatus"));
    }

    if (topicId == undefined)
    { 
      self.channels.push(self.createWebChannel());
      self.channels.push(self.createTwitterChannel());
      self.channels.push(self.createTwilioChannel());
      
    } else
    {
     $.ajax({
              url: 'api/topics',
              type: 'GET',
              data: {topicId: topicId},
              contentType: 'application/json; charset=utf-8',
              async: true,
              success: function(result) {
                self.populateTopicFromJson(result);
                $.ajax({
                  url: 'api/channels',
                  type: 'GET',
                  data: {topicId: topicId},
                  contentType: 'application/json; charset=utf-8',
                  async: true,
                  success: function(result) {
                    self.populateChannelsFromJson(result);
                  },
                  error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var msg = "We could not retrieved channels for topic with id " + topicId + " : " + textStatus + ". Please try again later";
                    $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                    console.log("some error occured: ", errorThrown);
                  }
                });
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "We could not retrieved the topic with id " + topicId + " : " + textStatus + ". Please try again later";
                $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }
            });
    }
}