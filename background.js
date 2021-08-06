//chrome.contextMenus.removeAll();
var searchit;
var widgt;
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

var old;
var newval;
var cal_pref;

chrome.storage.sync.get("settings", function(result) {
    settings = result.settings;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.settings !== undefined) {
        settings = changes.settings.newValue;
    }
});

chrome.tabs.onUpdated.addListener( function getTab (tabId, changeInfo, tab) {
    searchit = settings.searchphn;
    if (changeInfo.status == 'complete' && tab.active && searchit == 1) {
        console.log('Message is sent to content script');
        chrome.tabs.sendMessage(tab.id, {text : 'report_back'}, getDOM);
    }
});

var tabDom;
function getDOM(value) {
    tabDom = value;
    console.log(tabDom);
};

chrome.contextMenus.create({
    title: "Search phone number in current Tab",
    contexts: ["browser_action"],
    onclick: function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'report_back'}, function(response) {
                console.log(response.farewell);
            });     
       });
    }
});

var no;


chrome.browserAction.onClicked.addListener(function launchApplication() {
    var newWindow = null;
    if ((newWindow == null) || (newWindow.closed)) 
        newWindow = window.open(
    "popup.html",
    "ICT Agent",
    "width=340,height=630,scrollbars=no,toolbar=no,screenx=0,screeny=0,location=no,titlebar=0,directories=no,status=no,menubar=no"
  );
        newWindow.focus();
});


//Listening msgs from contentscript

chrome.extension.onRequest.addListener(function(request, sender)
{
    no = request.message;
    cal_pref = request.preference;
    setTimeout(myFunction, 1000);
    
});
function myFunction() {
    chrome.runtime.sendMessage({message: no, preference: cal_pref},function(response){
        console.log(response);
   });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
        widgt = settings.agent;
        console.log('I am Clicked');
        if (request.greeting == "Clicked" )
            if (widgt == true) {
                var newWindow = null;
                if ((newWindow == null) || (newWindow.closed)) 
                    newWindow = newWindow = window.open(
    "popup.html",
    "ICT Agent",
    "width=340,height=630,scrollbars=no,toolbar=no,screenx=0,screeny=0,location=no,titlebar=0,directories=no,status=no,menubar=no"
  );
                    newWindow.focus();
                }
   sendResponse({farewell: "goodbye"});
});

