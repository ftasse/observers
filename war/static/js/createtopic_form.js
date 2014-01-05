var currentModel = null;

(function () {
   "use strict";
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
                maxlength: 100,
                required: true
            },
            description: {
                minlength: 30,
                maxlength: 300,
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
    self.ownerUserId = ko.observable();

    self.channels = ko.observableArray([]);

    signInMessage($('#loginMessage'));

    self.mode = ko.computed(function() {
        if (self.id() !== null) {
          return "Edit Topic";
        }
        else {
          return "New Topic";
        }
      }, self);

    self.isAdmin = ko.computed(function() {
        if (user() === null)
          return true;
        else 
        {
          //console.log("Val " + user());
          //console.log("Val " + user().id);
          if (self.ownerUserId() !== user().id) {
            return  false;
          }
          else {
            return true;
          }
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
      self.ownerUserId(jsonData.ownerUserId);
      self.shortDescription(jsonData.shortDescription);
    };

    self.populateChannelsFromJson = function(jsonData) {
      var newChannels = [];
      var hasWeb = false;
      var hasTwitter = false;
      var hasTwilio = false;
      jsonData.sort(keysrt('source'));

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
          'id': ko.toJS(self.id),
          'title': ko.toJS(self.title),
          'shortDescription': ko.toJS(self.shortDescription)
        };
    };

    self.getChannelsJsonData = function() {
        jsonChannelData = [];
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
          if (channelData !== null)
          {
            jsonChannelData.push(channelData);
          }
        }
        console.log(JSON.stringify(jsonChannelData));
        return jsonChannelData;
      };

    self.saveAuthenticatedChannels = function () {
      jQuery('#successStatus').showLoading();
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
              }, 
              complete: function() { jQuery('#successStatus').hideLoading(); }
            });
    };

    self.saveAuthenticatedTopic = function() {
        //alert(JSON.stringify(getTopicJsonData()));
       // alert(JSON.stringify(getChannelsJsonData()));
        //$("#successStatus").html("<div class='alert alert-success'> Successfully saved topic details. </div>");
        //saveAuthenticatedChannels();
          jQuery('#successStatus').showLoading();
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
              },
              complete: function() { jQuery('#successStatus').hideLoading(); }
            });
    };

    self.saveChanges = function () {
      //alert(JSON.stringify(ko.toJS(self.channels)));
      /*runOnceAuthenticated(function() {
        self.saveAuthenticatedTopic();
      }, $("#successStatus"));*/
      self.saveAuthenticatedTopic();
    };

    self.deleteTopic = function () {
      function run () {
          jQuery('#successStatus').showLoading();
         $.ajax({
              url: 'api/topics?topicId=' + self.id(),
              type: 'DELETE',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                jQuery('#successStatus').hideLoading();
                window.location.href = "/";
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                if (button != undefined) $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
                jQuery('#successStatus').hideLoading();
              }
            });
        }

      /*runOnceAuthenticated(function() {
        showConfirmDialog("Are you sure you want to delete this topic? All the topic data will be deleted from our server.",
                          run);
      }, $("#successStatus"));*/
      showConfirmDialog("Are you sure you want to delete this topic? All the topic data will be deleted from our server.",
                          run);
    };

    self.refreshTweets = function(button) {
      function run () {
         if (button != undefined) jQuery('#successStatus').showLoading();
         $.ajax({
              url: 'api/twitter',
              type: 'GET',
              data: {topicId: self.id()},
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                if (button != undefined) $("#successStatus").html("<div class='alert alert-success'> Successfully fectched new tweets. </div>");
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                if (button != undefined) $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              }, 
              complete: function() { jQuery('#successStatus').hideLoading(); }
            });
        }

      /*runOnceAuthenticated(function() {
        run();
      }, $("#successStatus"));*/
      run();
    };

    self.refreshSMS = function(button) {
        function run () {
         if (button != undefined) jQuery('#successStatus').showLoading();
         $.ajax({
              url: 'api/twilio',
              type: 'GET',
              data: {topicId: self.id()},
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              async: true,
              success: function(result) {
                if (button != undefined) $("#successStatus").html("<div class='alert alert-success'> Successfully fetched outstanding SMS. </div>");
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                var msg = "An error occured: " + textStatus + ". Please try again later";
                if (button != undefined) $("#successStatus").html("<div class='alert alert-danger'>"+msg +"</div>");
                console.log("some error occured: ", errorThrown);
              },
              complete: function() { jQuery('#successStatus').hideLoading(); }
            });
        }

        /*runOnceAuthenticated(function() {
          run();
        }, $("#successStatus"));*/
        run();
    };

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