update_stop = false;

var extension = {};

var settings = {
    url: 'http://172.17.0.2/ictcore/api',
    username: 'user',
    password: 'user',
    token_uptodate: false,
    token: '',
    contact_load: 'www.google.com',
    phone_pattern: '([0-9-()+]{3,20})',
    agent: false,
    searchphn: false,
}

function setup_elements() {
    document.getElementById("url").addEventListener("blur", get_token);
    document.getElementById("username").addEventListener("change", get_token);
    document.getElementById("password").addEventListener("change", get_token);
    document.getElementById("conload").addEventListener("change", save_function);
    document.getElementById("phone_pattern").addEventListener("change", save_function);
    document.getElementById("searchphn").addEventListener("change", save_function);
    document.getElementById("widgtpop").addEventListener("change", save_function);
    document.getElementById("picktech").addEventListener("change", get_account);

    document.getElementById('reload').addEventListener("click", getListItems);
}

function readvalues() {
    chrome.storage.sync.get('settings', function (result) {
        console.log(result);
        if (result.settings !== undefined) {
            settings = result.settings;
            console.log(settings);
        }
        update_stop = true;
        document.getElementById("url").value = settings.url;
        document.getElementById("username").value=settings.username;
        document.getElementById("password").value=settings.password;
        document.getElementById("phone_pattern").value = settings.phone_pattern;
        document.getElementById("conload").value = settings.contact_load;
        document.getElementById("searchphn").checked = settings.searchphn;
        document.getElementById("widgtpop").checked = settings.agent;
        document.getElementById("picktech").value = settings.extension;
        update_stop = false;
    });
}
function get_account() {
    var def;
    def  = "Bearer " + settings.token; 
    console.log(def);
    extension = document.getElementById("picktech").value;
    $.ajax({  
        url: settings.url + "/accounts/" + extension + "/provisioning",  
        method: "GET",  
        headers: {
            'Authorization': def, 
            'Content-Type':'application/json'
        },
        success: function(result) {
            console.log(result);
            extension = JSON.parse(result);
            chrome.storage.sync.set({'extension': extension});
        },
        error: function(result) {
              console.log(result);
        }
   });
}

function save_function() {
    if (update_stop == true) {
        return;
    }

    settings.url = document.getElementById("url").value;
    settings.username = document.getElementById("username").value;
    settings.password = document.getElementById("password").value;
    settings.contact_load = document.getElementById("conload").value;
    settings.phone_pattern = document.getElementById("phone_pattern").value;
    settings.searchphn = document.getElementById("searchphn").value;
    if (document.getElementById("searchphn").checked) {
        console.log('I am checked');
        settings.searchphn = true;
    } else {
        settings.searchphn = false;
    }
    if (document.getElementById("widgtpop").checked) {
        settings.agent = true;
    } else {
        settings.agent = false;
    }

    console.log(settings);
    chrome.storage.sync.set({'settings': settings});
}

function make_base_auth(username, password) {
    var tok = settings.username + ':' + settings.password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

function get_token() {
    settings.username = document.getElementById("username").value;
    settings.password = document.getElementById("password").value;
    settings.url = document.getElementById("url").value;
    settings.token_uptodate = false;

    $.ajax
    ({
        type: "POST",
        url: settings.url + "/authenticate",
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "username": settings.username,
            "password": settings.password,
            "url": settings.url
        }),
        headers: {
            'Authorization':  make_base_auth(username, password),
            'Content-Type':'application/json'
        },
        beforeSend: function (xhr) { 
            xhr.setRequestHeader('Authorization', make_base_auth(username, password)); 
        },
        success: function (result) {
            settings.token = result.token;
            settings.token_uptodate = true;
            save_function();
            document.getElementById('status').innerHTML= "Access information tested successfully!";
        },
        error: function () { 
            save_function();
            document.getElementById('status').innerHTML= "Invalid access information";
        } 
    }); 
}

function getListItems( siteurl, success, failure) {
    var def;
        def  = "Bearer " + settings.token; 
        console.log(def);
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
            console.log(result);
            var selectInput  = "";       
            for(var i=0; i<result.length; i++) {
                var selectId= result[i].account_id;
                console.log(selectId);
                var selectVal= result[i].username + '(' + result[i].phone + ')';   
                selectInput  = '<option value='+ selectId +'>'+ selectVal +'</option>'; 
                $('#picktech').append(selectInput);
            }    
       },
       error: function (data) {  
          failure(data);
       }  
  });
}


document.addEventListener('DOMContentLoaded', readvalues);
document.addEventListener('DOMContentLoaded', setup_elements);
