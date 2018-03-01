// Listen for messages

var keywords;
var phone_regex;
var def;
var widgt;
var wigg;
var value;

var settings = {
    url: 'http://demo.ictcore.org/api',
    username : 'user',
    password : 'user',
    contact_load : 'https://www.google.com/search?q={phone_number}',
    phone_pattern : '([0-9-()+]{6,20})',
    token : 'abc',
    agent : false,
    extension : 3,
    searchphn:false    
}

function phone_click() {
    event.preventDefault();
    value = $(this).attr("href");
    chrome.runtime.sendMessage({greeting:"Clicked"}, function (response) {
        console.log(response.farewell);
        chrome.extension.sendRequest({message: value});
    });
}

chrome.storage.sync.get('settings', function(result) {
    settings = result.settings;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text == 'report_back') {
        def = request.text;
        var xyz = settings.phone_pattern;
        // phone_regex = /([0-9-()+]{3,20})/g; 
        phone_regex = RegExp(xyz, "g")
        var value;
        $('body').html(  $('body').html().replace(phone_regex,'<a href="$1" target="_blank" class="testClick">$1</a>') );
        console.log('I have received messgae from bg');  
        sendResponse("ok");
    }

    $(".testClick").click(phone_click); 
});     
 
 
   



