// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    //$.getScript("/js/jquery.showLoading.js", function(){

       //alert("Script loaded and executed.");
       // Here you can use anything you defined in the loaded script

       /*$(document).ajaxSend(function(event, request, settings) {
        //alert("Loading");
        //$('#loading-indicator').show();
        console.log("show loading");
        jQuery('#activity_pane').showLoading();
      });

      $(document).ajaxComplete(function(event, request, settings) {
          //$('#loading-indicator').hide();
          console.log("hide loading");
          jQuery('#activity_pane').hideLoading();
      });*/

    //});

}());

// Place any jQuery/helper plugins in here.
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

function loadSocialScripts() {
    loadFacebookScript(document, 'script', 'facebook-jssdk');
    loadGooglePlusScript();
    !loadTwitterScript(document, 'script', 'twitter-wjs');
}


function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
var mthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
Date.prototype.formatMMMDDYYYY = function(){
    var str = pad(this.getDate(), 2)  + '-' + mthNames[this.getMonth()] +  "-" +  this.getFullYear() + " " + pad(this.getHours(), 2)+":"+ pad(this.getMinutes(), 2);
    str += " GMT"; 
    var offset = this.getTimezoneOffset()/60
    if (offset < 0)
    {
      str += "-" + pad(-offset, 2);
    } else if (offset > 0)
    {
      str += "+" + pad(offset, 2);
    }
    return str;
}