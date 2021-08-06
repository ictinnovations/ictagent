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
    contact_load : 'https://www.google.com/search?q={phone_number}',
    phone_pattern : '([0-9-()+]{6,20})',
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
var cityName;
var def;
var infax = [];
var outfax = [];
var documentArray = [];
var file_name = '';
var file_type = '';
var file_content = '';

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
  var conload =  contct_url.replace(/{phone_number}/g,phone_number);
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
  
    console.log(request);
    var res = request.message;
    console.log('I am invoked');
    console.log(res);
    
    if (res != undefined) {
      switch (request.preference) {
      case 'voice':
        dial_a_number(res);
        break;
      case 'fax':
        $('#dialer').show();
        $('#a').hide();
        newfax();
        document.getElementById("fax_number").value = res;
        break;
      case 'whatsapp':
        break;
      case 'sms':
        break;
      default:
        dial_a_number(res);
      }
    }
   
    sendResponse("hiiiiii");
    return true;
});

function setup_elements() {

  $('#newfaxform').hide();
  $('#receivedFaxes').hide();
  $('#sentFaxes').hide();
  $('#newdocumentform').hide();

  document.getElementById("call_tab").addEventListener("click", openCity);
  document.getElementById("dialer_tab").addEventListener("click", openCity);
  document.getElementById("newfax").addEventListener("click", newfax);
  document.getElementById("newdocument").addEventListener("click", newdocument);
  document.getElementById("showreceived").addEventListener("click", receivedfax);
  document.getElementById("showsent").addEventListener("click", sentfax);
  document.getElementById("submitdocumentform").addEventListener("click", add_document);
  document.getElementById("back2dashboard").addEventListener("click", show_dashboard);
  document.getElementById("back2dashboard1").addEventListener("click", show_dashboard);
  document.getElementById("back2dashboard2").addEventListener("click", show_dashboard);
  document.getElementById("back2dashboard3").addEventListener("click", show_dashboard);
  document.getElementById("sendfaxbutton").addEventListener("click", sendnewfax);
  
  
  $('#document_file').on('change', function() {
    var fileReader = new FileReader();
    file_name = $('#document_file').val().split('\\').pop();
    file_type = $('#document_file').prop('files')[0].type;
    console.log(file_type);
    document.getElementById("doc_file_err").innerHTML = '';
    fileReader.onload = function () {
      file_content = fileReader.result;  
    };
    fileReader.readAsDataURL($('#document_file').prop('files')[0]);
  });
  
  get_documents();
  
  $('#document_name').on('keyup', function () {
    if ($('#document_name').val() == '' ) {
      document.getElementById("doc_name_err").innerHTML = 'Please Enter name';
      document.getElementById("doc_name_err").style.color = "red";
    }
    else {
      document.getElementById("doc_name_err").innerHTML = '';
    }
    
  });
  
  $('#select_doc').on('change', function() {
    if (this.value == '-1') {
      document.getElementById("doc_fax_err").innerHTML = 'Please select document';
      document.getElementById("doc_fax_err").style.color = 'red';
    }
    else {
      document.getElementById("doc_fax_err").innerHTML = '';
    }
  });
  
  $('#fax_number').on('keyup', function () {
    if ($('#fax_number').val() == '' ) {
      document.getElementById("phone_err").innerHTML = 'Please Enter Number';
      document.getElementById("phone_err").style.color = "red";
    }
    else {
      document.getElementById("phone_err").innerHTML = '';
    }
    
  });

  
}

function openCity(evt) {
  var menu_name = evt.target.textContent;
  if (menu_name == 'Call') {
    $('#dialer').hide();
    $('#a').show();
  }
  else {
    $('#dialer').show();
    $('#a').hide();
  }
}

function newfax() {
  get_documents().then(response => {
  documentArray = response;
    console.log(response);
  var selectbox = document.getElementById("select_doc");
  documentArray.forEach(function(doc, index) {
      var opt = document.createElement('option');
      opt.innerHTML = doc.name;
      opt.value = doc.document_id;
      selectbox.appendChild(opt);
  });
  })
  
  $('#faxManagement').hide();
  $('#receivedFaxes').hide();
  $('#newfaxform').show();
  $('#newdocumentform').hide();
  $('#sentFaxes').hide();
  
  
}

function newdocument() {
  $('#faxManagement').hide();
  $('#receivedFaxes').hide();
  $('#newfaxform').hide();
  $('#newdocumentform').show();
  $('#sentFaxes').hide();
}

function receivedfax() {
  $('#faxManagement').hide();
  $('#receivedFaxes').show();
  $('#newfaxform').hide();
  $('#newdocumentform').hide();
  $('#sentFaxes').hide();
  
  get_receivedFaxList();
   
  setInterval(function(){
    get_receivedFaxList();
  }, 2000); 
  
}

function get_receivedFaxList() {
  def  = "Bearer " + settings.token; 
    $.ajax({  
        url: settings.url + "/transmissions?service_flag=2&direction=inbound" ,  
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        success: function(result) {
            infax = JSON.parse(result);
            console.log(infax);
            infax.reverse();
            convert_timestamp();
        },
        error: function(result) {
              console.log(result);
        }
   });
}

async function get_documents() {
    
    def  = "Bearer " + settings.token; 
    var url =  settings.url + "/documents";
    
    const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Authorization':  def,
            'Content-Type':'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          });
          return response.json(); // parses JSON response into native JavaScript objects
        }

function sentfax() {
  $('#faxManagement').hide();
  $('#receivedFaxes').hide();
  $('#newfaxform').hide();
  $('#newdocumentform').hide();
  $('#sentFaxes').show();
  
  get_sentfaxlist();
  
  setInterval(function(){
    get_sentfaxlist();
  }, 2000); 
    
}

function get_sentfaxlist() {

  def  = "Bearer " + settings.token; 
    $.ajax({  
        url: settings.url + "/transmissions?service_flag=2&direction=outbound" ,  
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        success: function(result) {
            outfax = JSON.parse(result);
            outfax.reverse();
            convert_timestamp_outfax();

        },
        error: function(result) {
              console.log(result);
        }
   });
}




function show_dashboard() {
  $('#faxManagement').show();
  $('#receivedFaxes').hide();
  $('#newfaxform').hide(); 
  $('#newdocumentform').hide();
  $('#sentFaxes').hide();
}

function convert_timestamp() {
  infax.forEach(function(entry) {
    entry.last_run = new Date(entry.last_run * 1000).toGMTString();
  });
  $('#receivedFaxes div').remove();
  $('#receivedFaxes br').remove();
  prepare_receivedfax();
} 

function convert_timestamp_outfax() {
  outfax.forEach(function(entry) {
    entry.last_run = new Date(entry.last_run * 1000).toGMTString();
  });
  $('#sentFaxes div').remove();
  $('#sentFaxes br').remove();
  prepare_sentfax();
}

function prepare_receivedfax() {
  infax.forEach(function(entry) {
    console.log(entry);
    // var ptag = '<p style="color:white">' + entry.contact_phone + '<p>';
    // $('#receivedFaxes').append(ptag);
    $('#receivedFaxes').append('<div id="fax_tab"><label style="font-size: 22px;">' + 'Phone number' + '</label><label style="position: relative;float: right;">' + entry.status + '</label><br><label>' + entry.contact_phone + '</label><br><br><label style="font-size:10px">' + entry.last_run + '</label><span style="float:right" class="glyphicon glyphicon-download"><a class="infax_download" target="_blank" href=' + entry.transmission_id + ' >Download</a></span></div><br>');
  })
  
  $(".infax_download").click(get_documentId); 
}

function prepare_sentfax() {
  outfax.forEach(function(entry) {
    console.log(entry);
    // var ptag = '<p style="color:white">' + entry.contact_phone + '<p>';
    // $('#receivedFaxes').append(ptag);
    $('#sentFaxes').append('<div id="fax_tab"><label style="font-size: 22px;">' + 'Phone number' + '</label><label style="position: relative;float: right;">' + entry.status + '</label><br><label>' + entry.contact_phone + '</label><br><br><label style="font-size:10px">' + entry.last_run + '</label></div><br>');
  })
  
}


function get_documentId() {
  
  event.preventDefault();
  
  console.log($(this).attr("href"));
  var transmission_id = $(this).attr("href");
  // value = $(this).attr("href");
  // console.log(value);
  
  def  = "Bearer " + settings.token; 
    $.ajax({  
        url: settings.url + "/transmissions/" + transmission_id + "/results?name=document",  
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        success: function(result) {
            var parsedResult = JSON.parse(result);
            let document_id = parsedResult[0].data;
            download_document(document_id);
        },
        error: function(result) {
              console.log(result);
        }
   });
  
  
}

function download_document(document_id) {
  def  = "Bearer " + settings.token; 
    $.ajax({  
        url: settings.url + "/documents/" + document_id + "/media",  
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        xhrFields: {
          responseType: 'blob'
        },
        success: function(blob){
          console.log(blob.size);
          var link=document.createElement('a');
          link.href=window.URL.createObjectURL(blob);
          link.download="document_" + document_id + ".pdf";
          link.click();
        },
        error: function(result) {
              console.log(result);
        }
   });
}

function add_document() {

  if ($('#document_name').val() == '' ) {
    document.getElementById("doc_name_err").innerHTML = 'Please Enter name';
    document.getElementById("doc_name_err").style.color = "red";
    return;
  }
  
  if ($('#document_file').val() == '' ) {
    document.getElementById("doc_file_err").innerHTML = 'Please Select File';
    document.getElementById("doc_file_err").style.color = "red";
    return;
  }
  
  if (file_type == 'application/pdf' || file_type == 'image/png' || file_type == 'image/jpg' || file_type == 'image/jpeg' || file_type == 'image/tiff' || file_type == 'image/tif' || file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file_type == 'application/msword' || file_type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file_type == 'application/vnd.ms-powerpoint' || file_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file_type == 'application/vnd.ms-excel' || file_type == 'application/vnd.oasis.opendocument.text' || file_type == 'application/vnd.oasis.opendocument.presentation' ||  file_type == 'application/vnd.oasis.opendocument.spreadsheet') {
  
    
        
  }
  else {
    document.getElementById("doc_file_err").innerHTML = 'Unsupported file type';
    document.getElementById("doc_file_err").style.color = "red";
    return;
  }

  document.getElementById("doc_name_err").innerHTML = '';
  document.getElementById("doc_file_err").innerHTML = '';
  
  var document_name = document.getElementById("document_name").value;
  var document_description = document.getElementById("document_description").value;
  
  def  = "Bearer " + settings.token; 
  
  $('#myModal').modal('show');
  document.getElementById("modal_title").innerHTML = 'Message';
  document.getElementById("modal_body").innerHTML = 'Adding Document';
  
  $.ajax
    ({
        type: "POST",
        url: settings.url + "/documents",
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "name": document_name,
            "description": document_description,
        }),
        headers: {
            'Authorization':  def,
            'Content-Type':'application/json'
        },
        success: function (result) {
           console.log(result); 
           document.getElementById("modal_body").innerHTML = 'Document created. Adding attachment ...';
           send_attachment(result);
        },
        error: function (result) { 
           console.log(result);
           document.getElementById("modal_title").innerHTML = 'Error';
           document.getElementById("modal_body").innerHTML = 'Document not added. Please try again';
           setTimeout(function(){ $("#myModal").modal('hide'); }, 2000);

        } 
    });  
  
}

function send_attachment(document_id) {

  postData(settings.url + "/documents/" + document_id + "/media", { answer: 42 }).then(data => {
    console.log(data); // JSON data parsed by `response.json()` call
    document.getElementById("modal_body").innerHTML = 'Attachment added successfully';
    $('#myModal').modal('hide');
    show_dashboard();
  })
  .catch(err => {
    document.getElementById("modal_title").innerHTML = 'Error';
    document.getElementById("modal_body").innerHTML = 'Attachment not added. Please try again';
    setTimeout(function(){ $("#myModal").modal('hide'); }, 2000);
    console.log(err)
  });

}

async function postData(url = '', data = {}) {
          // Default options are marked with *
          const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Authorization':  def,
              'Content-Type': 'base64'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: file_content // body data type must match "Content-Type" header
          });
          return response.json(); // parses JSON response into native JavaScript objects
        }


function sendnewfax() {

  var document_id = $('#select_doc').find(":selected").val();
  
  var retry = $('#choose_retry').find(":selected").val();
  
  var title = document.getElementById("fax_title").value;
  
  var phone_number = document.getElementById("fax_number").value;
  
  if (document_id == '-1') {
    document.getElementById("doc_fax_err").innerHTML = 'Please select document';
    document.getElementById("doc_fax_err").style.color = 'red';
    return;
  }
  
  if (phone_number == '') {
    document.getElementById("phone_err").innerHTML = 'Please Enter Number';
    document.getElementById("phone_err").style.color = "red";
    return;
  }
  
  $('#myModal').modal('show');
  document.getElementById("modal_title").innerHTML = 'Message';
  document.getElementById("modal_body").innerHTML = 'Please wait we are sending fax...';
  
  create_fax_program(document_id).then(program_id => {
    create_transmission(program_id, title, phone_number, retry).then(transmission_id => {
      console.log(transmission_id);
      send_transmission(transmission_id).then(response => {
        console.log(response);
        setTimeout(function(){ $("#myModal").modal('hide'); }, 2000);
        sentfax();
      })
      .catch(err => {
        console.log(err);
        document.getElementById("modal_title").innerHTML = 'Error';
        document.getElementById("modal_body").innerHTML = 'Fax not sent. Please try again';
        setTimeout(function(){ $("#myModal").modal('hide'); }, 2000);
      });
    })
    .catch(err => {
      console.log(err);
      document.getElementById("modal_title").innerHTML = 'Error';
      document.getElementById("modal_body").innerHTML = 'Fax not sent. Please try again';
      setTimeout(function(){ $("#myModal").modal('hide'); }, 2000);
    });
  })
  .catch(err => { 
    console.log(err);
    document.getElementById("modal_title").innerHTML = 'Error';
    document.getElementById("modal_body").innerHTML = 'Fax not sent. Please try again';
    setTimeout(function(){ $("#myModal").modal('hide'); }, 2000); 
  });
  
  
}

async function create_fax_program(document_id) {

  def  = "Bearer " + settings.token; 
  var url =  settings.url + "/programs/sendfax";
    
  const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Authorization':  def,
            'Content-Type':'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
              "document_id": document_id,
            })
          });
          return response.json(); // parses JSON response into native JavaScript objects
  
}

async function create_transmission(program_id, title, phone, retry) {

  def  = "Bearer " + settings.token; 
  var url =  settings.url + "/transmissions";
    
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Authorization':  def,
      'Content-Type':'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      "program_id": program_id,
      "title": title,
      "try_allowed": retry,
      "phone": phone
    })
  });
  return response.json(); 
}


async function send_transmission(transmission_id) {

  def  = "Bearer " + settings.token; 
  var url =  settings.url + "/transmissions/" + transmission_id + "/send";
    
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Authorization':  def,
      'Content-Type':'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      "transmission_id": transmission_id,
    })
  });
  return response.json(); 
}



document.addEventListener('DOMContentLoaded', setup_elements);
document.addEventListener('DOMContentLoaded', readvalues);
