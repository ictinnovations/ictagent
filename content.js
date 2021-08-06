// Listen for messages

var keywords;
var phone_regex;
var def;
var widgt;
var wigg;
var value;
var domUpdate = false;

var settings = {
    url: 'http://demo.ictcore.org/api',
    username : 'user',
    password : 'user',
    contact_load : 'https://www.google.com/search?q={phone_number}',
    phone_pattern : '([0-9-()+]{6,20})',
    token : 'abc',
    agent : false,
    extension : 3,
    searchphn:false,
    call_preference: 'voice'    
}

function phone_click() {
    
    event.preventDefault();
    
    value = $(this).attr('href');
    console.log(value);
    
    chrome.runtime.sendMessage({greeting:"Clicked"}, function (response) {
        console.log(response.farewell);
        chrome.extension.sendRequest({message: value, preference: settings.call_preference});
    });
    
}

function option_click() {
    event.preventDefault();
    
     var call_prefer = $(this).attr('href');
     value = $(this).parent()[0].parentElement.childNodes[0].value;
    
    chrome.runtime.sendMessage({greeting:"Clicked"}, function (response) {
        console.log(response.farewell);
        chrome.extension.sendRequest({message: value, preference: call_prefer});
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
        
function replaceInElement(element, find, replace) {
    // iterate over child nodes in reverse, as replacement may increase
    // length of child node list.
    for (var i= element.childNodes.length; i-->0;) {
        var child= element.childNodes[i];
        if (child.nodeType==1) { // ELEMENT_NODE
            var tag= child.nodeName.toLowerCase();
            if (tag!='style' && tag!='script') // special case, don't touch CDATA elements
                replaceInElement(child, find, replace);
        } else if (child.nodeType==3) { // TEXT_NODE
            replaceInText(child, find, replace);
        }
    }
}
function replaceInText(text, find, replace) {
    var match;
    var matches= [];
    while (match= find.exec(text.data))
        matches.push(match);
    for (var i= matches.length; i-->0;) {
        match= matches[i];
        text.splitText(match.index);
        text.nextSibling.splitText(match[0].length);
        text.parentNode.replaceChild(replace(match), text.nextSibling);
    }
}

// keywords to match. This *must* be a 'g'lobal regexp or it'll fail bad

// replace matched strings with wiki links
replaceInElement(document.body, phone_regex, function(match) {
    var link= document.createElement('a');
    link.href = match[0];
    link.target = "_blank";
    link.className = "testClick";
    link.value = match[0];
    link.appendChild(document.createTextNode(match[0]));
    return link;
});

        // $('body').html(  $('body').html().replace(phone_regex,'<a href="$1" target="_blank" class="testClick">$1</a>') );
        console.log('I have received messgae from bg');  
        
        if (domUpdate == false) {
        
           $("a.testClick").wrap("<span class='dropdown'></span>");
           $( ".dropdown" ).append( "<div class='dropdown-content'><a href='voice' value='voice' class='options'>Voice</a><a href='fax' class='options' value='fax'>Fax</a><a href='voice' class='options' value='sms'>SMS</a><a href='voice' class='options' value='whatsapp'>WhatsApp</a></div>" );

           $('head').append('<style>.dropdown { position: relative;  display: inline-block; } .dropdown-content {display: none;position: absolute;background-color: #ffff;min-width: 160px;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);padding: 12px 16px;z-index: 1;} .dropdown:hover .dropdown-content { display: block; } .dropdown-content a:hover {background-color: #8AEAF5;}.dropdown-content a {color: black;padding: 12px 16px;text-decoration: none;display: block;text-align: left;}</style>');
           
           domUpdate = true;
          
        }
        
       
        
        
        sendResponse("ok");
    }

    $(".testClick").click(phone_click); 
    $(".options").click(option_click); 
});        

