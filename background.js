//chrome.contextMenus.removeAll();
var searchit;
var widgt;
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

var old;
var newval;
chrome.storage.sync.get("settings", function(result) {
    settings = result.settings;
    console.log('============ setting context ===========');
    console.log(settings);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes);
    if (changes.settings !== undefined) {
        settings = changes.settings.newValue;
        console.log(settings);
    }
});

chrome.tabs.onUpdated.addListener( function getTab (tabId, changeInfo, tab) {
    console.log('============ tab context ===========');
    searchit = settings.searchphn;
    console.log("Search Phone", searchit);
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
    title: "default",
    contexts: ["browser_action"],
    onclick: function() {
        var newWindow = null;
        if ((newWindow == null) || (newWindow.closed)) 
            newWindow = window.open('popup.html','testName','width=320,height=320,scrollbars=yes,resizable=yes');
            newWindow.focus();
    }
});

chrome.contextMenus.create({
    title: "Search phone number",
    contexts: ["browser_action"],
    onclick: function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log(settings);
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
        newWindow = window.open('popup.html','testName','width=320,height=320,scrollbars=yes,resizable=yes');
        newWindow.focus();
});


//Listening msgs from contentscript

chrome.extension.onRequest.addListener(function(request, sender)
{
    no = request.message;
    console.log(no);
    setTimeout(myFunction, 1000);
    
});
function myFunction() {
    chrome.runtime.sendMessage({message: no},function(response){
        console.log(response);
   });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
        widgt = settings.agent;
        console.log(widgt);
        console.log('I am Clicked');
        if (request.greeting == "Clicked" )
            if (widgt == true) {
                var newWindow = null;
                if ((newWindow == null) || (newWindow.closed)) 
                    newWindow = window.open('popup.html','testName','width=320,height=320,scrollbars=yes,resizable=yes');
                    newWindow.focus();
                }
   sendResponse({farewell: "goodbye"});
});

