// Listen for messages

var keywords;
var phone_regex;
var def;
var widgt;
var wigg;
var value;

var settings = {
    url: 'http://172.17.0.2/ictcore/api',
    username : 'user',
    password : 'user',
    contact_load : 'www.google.com',
    phone_pattern : '([0-9-()+]{3,20})',
    token : 'abc',
    agent : false,
    extension : 3,
    searchphn:false    
}

function phone_click() {
    event.preventDefault();
    value = $(this).attr("href");
    console.log(value); 
    chrome.runtime.sendMessage({greeting:"Clicked"}, function (response) {
        console.log(response.farewell);
        chrome.extension.sendRequest({message: value});
    });
}

chrome.storage.sync.get('settings', function(result) {
    settings = result.settings;
    console.log('============ setting context ===========');
    console.log(settings);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text == 'report_back') {
        def = request.text;
        console.log(def);
        console.log(settings);
        var xyz = settings.phone_pattern;
        // phone_regex = /([0-9-()+]{3,20})/g; 
        phone_regex = RegExp(xyz, "g")
        console.log(phone_regex);
        var value;
        $('body').html(  $('body').html().replace(phone_regex,'<a href="$1" target="_blank" class="testClick">$1</a>') );
        console.log('I have received messgae from bg');  
        sendResponse("ok");
    }

    $(".testClick").click(phone_click); 
});     
 
 
   



