'use strict';
var contct_url;
var simple;
var activeCall;
var num;
var remoteId;
var extension;
var settings = {
    url: 'http://demo.ictcore.org/api',
    username : 'user',
    password : 'user',
    contact_load : 'https://www.google.com/search?q=findSomething',
    phone_pattern : '([0-9-()+]{3,20})',
    token : 'abc',
    agent : false,
    searchphn:false,
}
var in_number;
var in_name;
var C = {
  STATUS_NULL:         0,
  STATUS_NEW:          1,
  STATUS_CONNECTING:   2,
  STATUS_CONNECTED:    3,
  STATUS_COMPLETED:    4
};
var options;

function readvalues() {

    chrome.storage.sync.get("settings", function(result) {
        settings = result.settings;
        contct_url = settings.contact_load;
    });

    chrome.storage.sync.get("extension", function(result) {
        if (result.extension !== undefined) {
            extension = result.extension;
       }

        setup_popup();
        getListItems();
    });
}

function setup_popup() {
    options = {
    media: {
      local: {
        audio: document.getElementById('localVideo')
      },
      remote: {
        audio: document.getElementById('remoteVideo')
      }
    },
    ua: {
        uri: extension.username + '@' + extension.host,
        authorizationUser: extension.username,
        password: extension.password,
	wsServers: ['wss://' + extension.host + ':' + extension.wss],
       register: true,
       // traceSip: true,
    }
  };
  
  simple = new SIP.WebRTC.Simple(options);
  
  simple.on('connected', function() {
      $()
      event_answer();
      
  });
  
  simple.on('ringing', function() {
      var get_remote = simple.session.remoteIdentity.toString();
      var matches = get_remote.match(/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]/g);
      var coming_number = matches[0].match(/[A-Za-z0-9_-]+/g);
      in_number = coming_number[0];
      in_name = simple.session.remoteIdentity.displayName;
      event_incomming(in_number, in_name);
  });
    
  simple.on('ended', function() {

      
      event_hangup();
  });
  

  
  simple.on('connecting', function() {
     
  });
  
    
}

navigator.webkitGetUserMedia({
    audio: true,
}, function(stream) {
    var msg = 'gUM succeeded at ' + document.URL + ' which is a child frame at ' + location.ancestorOrigins[0];
    console.info(msg);
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; ++i) {
        tracks[i].stop();
    }
}, function(e) {
    var msg = 'gUM failed at ' + document.URL + ' which is a child frame at ' + location.ancestorOrigins[0] + ': ' + e;
    console.info(msg);
});

function load_contact(phone_number) {
  console.log(phone_number);
  var conload =  contct_url.replace(/phone_number/g,phone_number);
  window.open(conload, '_blank');
}


function getListItems( siteurl, success, failure) {
    var def;
        def  = "Bearer " + settings.token; 
    $.ajax({  
        url: settings.url + "/accounts", 
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        success: function (data) {
           
            var result  = JSON.parse(data);  
            update_extension_list(result); 
            console.log(result);  
       },
       error: function (data) {  
          console.log(data);
       }  
  });
}

// listener for call
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  
    var res = request.message;
    console.log('I am invoked');
    if (res !== undefined) {
    console.log('Making Call');
    // var b = res + '@'+ extension.host;
    dial_a_number(res);
    }
    sendResponse("hiiiiii");
    return true;
});

document.addEventListener('DOMContentLoaded', readvalues);
