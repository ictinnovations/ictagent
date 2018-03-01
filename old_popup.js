'use strict';
var url;
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
var session_name;
var remote_id;
var get_session_number;
var final_number;
var incoming_domain;
var incoming_number;
var incoming_name;

function setup_elements() {
    document.getElementById("phone_number").addEventListener("blur", myFunction);
    document.getElementById('call').addEventListener("click", call_function);
    document.getElementById("online").addEventListener("click", onlinefunction);
    document.getElementById("hangup").addEventListener("click", hangup_function);
    document.getElementById("offline").addEventListener("click", offlinefunction);
    document.getElementById('answer').addEventListener("click", answer_function);
    document.getElementById('endCall').addEventListener("click", end_outgoing);
    document.getElementById('incoming_endCall').addEventListener("click", incoming_end);
    document.getElementById("picktech").addEventListener("change", redirect_call);
    document.getElementById('1').addEventListener("click",  send_one);
    document.getElementById('2').addEventListener("click", send_two);
    document.getElementById('3').addEventListener("click", send_three);
    document.getElementById('4').addEventListener("click", send_four);
    document.getElementById('5').addEventListener("click", send_five);
    document.getElementById('6').addEventListener("click", send_six);
    document.getElementById('7').addEventListener("click", send_seven);
    document.getElementById('8').addEventListener("click", send_eight);
    document.getElementById('9').addEventListener("click", send_nine);
    document.getElementById('0').addEventListener("click", send_zero);
    document.getElementById('*').addEventListener("click", send_asterik);
    document.getElementById('#').addEventListener("click", send_hash);
}

function readvalues() {

    chrome.storage.sync.get("settings", function(result) {
        settings = result.settings;
        url = settings.contact_load;
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
    var options = {
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
       traceSip: true,
    }
  };
  
  simple = new SIP.WebRTC.Simple(options);
  
  simple.on('connected', function() {
      $( "div#screennormal" ).hide();
      $( "div#screencalling" ).toggle();
      $("div#screendialing").hide();
      $("div#screenringing").hide();
      methodCaller = 'eventTiming';
      changeActivity('eventTiming');
      remoteId = simple.session.remoteIdentity.friendlyName;
     // document.getElementById('incallId').innerHTML=remoteId + ' is in call with you';
      var conload =  url.replace(/findSomething/g,remoteId);
      // document.getElementById("lc").href = conload;
  });
  
  simple.on('ringing', function() {
  
      var get_remote = simple.session.remoteIdentity.toString();
      
      var matches = get_remote.match(/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]/g);
      var coming_number = matches[0].match(/[A-Za-z0-9_-]+/g);
      var coming_domain = matches[0].match(/[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]/g);
      incoming_number = coming_number[0];
      incoming_domain = coming_domain[0];
      incoming_name = simple.session.remoteIdentity.displayName;
      call_status_ring(incoming_number, incoming_domain, incoming_name);
      $( "div#screennormal" ).toggle();
      $( "div#screenringing" ).toggle();
      // document.title = "Incoming Call";
      // document.getElementById('CallerId').innerHTML=remoteId + ' is calling you';
      console.log("Phone is Ringing");
      
  });
    
  simple.on('ended', function() {
      $( "div#screennormal" ).show();
      $("div#screencalling").hide();
      $("div#screenringing").hide();
      $("div#screendialing").hide();
      // targetActivity = 'idle';
      // changeActivity('idle');
      console.log("Call Ended");
     // methodCaller = 'callUncallButton';
     // changeActivity('callUncallButton');
     // i = 'idle';
     //console.log(i);
     // resetActivity();
  });
  
  simple.on('connecting', function() {
      $( "div#screennormal" ).hide();
      $( "div#screencalling" ).hide();
      $("div#screendialing").show();
      $("div#screenringing").hide();
      session_name = simple.session.remoteIdentity.toString();
      remote_id = session_name.match(/[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.([A-Za-z0-9_-][A-Za-z0-9_]+)+\.[A-Za-z0-9_-]+/g);
      get_session_number = remote_id[0].match(/[A-Za-z0-9_-]+/g);
      final_number = get_session_number[0];
      call_status_dial(final_number);
      
      // console.log("Call is being connecting");
     
      // methodCaller = 'callUncallButton';
      // changeActivity('callUncallButton');
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


function do_stuff () {
    $( "div#screennormal" ).show();
    $( "div#screencalling" ).hide();
    $( "div#screenringing" ).hide();
    $( "div#screendialing" ).hide();
}

function myFunction() {
    num = document.getElementById('phone_number').value;
    if (num == "") {
        document.getElementById('fieldempty').innerHTML="Please Enter number"; 
    }
     if (num !== "") {
        document.getElementById('fieldempty').innerHTML=""; 
    }
}

function onlinefunction() {
    if (simple == undefined) {
        document.getElementById('online_error').innerHTML="Please Configure your Phone";
    }
    else if (simple !== undefined) {
        simple.call(extension.dialplan.agent_login);
    }
}


function offlinefunction() {
    simple.hangup();
}


function call_function () {
    if (simple !== undefined) {
        if (num == "") {
            document.getElementById("callError").innerHTML = "No number to dial";
        }
        else if (num !== "") {
            $( "div#screennormal" ).toggle();
            $( "div#screendialing" ).toggle();
            var a = num + '@' + extension.host;
            document.getElementById('call_number').innerHTML=a;
            document.getElementById("callError").innerHTML = "";
            simple.call(a);
        }
    }    
    else if (simple == undefined) {
        document.getElementById("callError").innerHTML = "Please Configure Phone";
    }
}


function send_one() {
    simple.session.dtmf(1);
    var one = $(this).val();
}

function send_two() {
    simple.session.dtmf(2);
}

function send_three() {
    simple.session.dtmf(3);
}

function send_four() {
    simple.session.dtmf(4);
}

function send_five() {
    simple.session.dtmf(5);
}

function send_six() {
    simple.session.dtmf(6);
}

function send_seven() {
    simple.session.dtmf(7);
}

function send_eight() {
    simple.session.dtmf(8);
}

function send_nine() {
    simple.session.dtmf(9);
}

function send_zero() {
    simple.session.dtmf(0);
}

function send_asterik() {
    simple.session.dtmf('*');
}

function send_hash() {
    simple.session.dtmf('#');
}

function incoming_end () {
    $( "div#screennormal" ).toggle();
    $( "div#screenringing" ).toggle();
    simple.reject();
}


function answer_function() {
    simple.answer();
}

function end_outgoing () {
    $( "div#screennormal" ).toggle();
    $( "div#screendialing" ).toggle();
    simple.hangup();
}

function hangup_function () {
    $( "div#screennormal" ).toggle();
    $( "div#screencalling" ).toggle(); 
    simple.hangup();
}

function redirect_call() {
    var selector = document.getElementById("picktech").value;
    simple.session.refer(selector);
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
            $("#picktech option").remove();
            var result  = JSON.parse(data);  
            var selectInput  = "";       
            for(var i=0; i<result.length; i++) {
                var selectId= result[i].phone;
                var selectVal= result[i].username + '(' + result[i].phone + ')';   
                selectInput  = '<option value='+ selectId +'>'+ selectVal +'</option>'; 
                $('#picktech').append(selectInput);
            }    
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
    console.log(res);
    var b = res + '@'+ extension.host;
    // document.getElementById('call_number').innerHTML=b;
    simple.call(b);
    targetActivity = 'outgoing';
    console.log("IN popup", targetActivity);
    sendResponse("hiiiiii");
    return true;
});
document.addEventListener('DOMContentLoaded', readvalues);
// document.addEventListener('DOMContentLoaded', setup_elements);
document.addEventListener('DOMContentLoaded', do_stuff);

