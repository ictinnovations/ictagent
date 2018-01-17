WebRTC based phone Extension
================
This extension will embed WebRTC based Voip phone in browser, this phone will remain connected to the main server and will be responsible for inbound,outbound,transfer calling as well as for sending DTMF.
This extension has following components:
1. Popup
2. Popup html
3. Background
4. Content
5. Manifest
5. Options page

Popup Roles and responsibilites
----------------
Popup has following components:
1. Popup.html
2. Popup.js


 **Popup.html**
Popup.html has several divs which will be displayed depending on their condition.
 **Screen Normal**
Its the very first screen that appears when the user clicks on the browser action i.e on the icon of the extension in toolbar.It has calling functionality. User can dial any number from this screen. (div#screennormal)


 **Screen Dialing**
This screen appears when a user dials a number and clicks on the call button.It has an end call button.(div#screendialing)


 **Screen Ringing**
When the inbound calls come this screen appears , it will have a feature of answering and rejecting it. (div#screenringing)


 **Screen Calling**
This screen will be displayed when an inbound call is answered .It has Reject, Transfer,Send DTMF buttons. (div#screencalling)


 **Popup.js**

**Popup Function**
--------------------
Popup is a javascript file that has been integrated with the popup.html. All the buttons in html file perform some task and instructions of carrying that task is given in popup.js.In this case it has all the call related functions like accept ,reject, end,transfer, and send  DTMF.

**Functions**

1. GetUserMedia
2. Call
3. Answer
4. End
5. Transfer
6. SendDTMF
7. Chrome.runtime.onMessage.addListener which listens to the value sent as message by background stores the value and passes that value to the call function as an argument, which dials the number.

 ---------------------------

**Background responsibilities and functions**
--------------------

 Background is a javascript file that has the code which controls the behaviour of extension, and performs various functions upon clicking the extension.This page runs in an isolated environment therefore it uses message passing to interact with content and popup.Google has provided APIs for message passing, Live connections have been used as well for the interaction.

**Functions**
1. chrome.tabs.onUpdated.addListener has function getTab() which gets the tab id of current web page and sends the messaeg to content script. 
2. Browser action has a function launchApplication() which monitors that if window is open it prevents more windows from opening , and if no window is open it opens a new window. 
3. chrome.extension.onRequest.addListener listens to the message sent by the content which is the number to be called. It takes the number, stores it and sends the request to the popup and sends the number as an argument.
 ------------------

**Content Responsibilites**
--------------------
If an extension wants to alter the web page no file other than content.js has access for altering this page.It can interact with background.js through message passing.

**Functions**
1. Chrome.runtime.sendMessage.addListener which listens to the message sent by the background and executes the functions which executes the functions and replaces the number with a clickable links.
2. Onclicking the link it will take the value and will save it in variable.
3. Chrome.extension.sendRequest sends the stored value as an argument to the background.
 -----------------------

**Manifest Responsibilities**
--------------------
Manifest file is in JSON format. Using manifest.json we specify basic metadata about extension such as the name and version, and can also specify aspects of extension's functionality, such as background scripts, content scripts, and browser actions, permissions like tabs as background can access the tab data to alter its content. It will ask for the permissions of **activeTab** to fetch the current tab data.
 
 
 -------------------

**Chrome Buttons/Actions**
--------------------
When a user clicks on the browser action i.e extension icon specific functions are performed like it open the popup window by executing the function. On clicking the browser action an event **chrome.browserAction.onClicked.addListener** in background.js will be fired which will execute a function **launchApplication()** it first checks if there is an existing window , if not it opens this window , but if there is an existing window it rejects the call. 
 
----------------------

**Settings**
--------------------
 The settings page consist of :
  * Authentication
    It takes the credentials from user and on the basis of that authentication result it lets the user use WebRTC phone.

  --------------------------

**Scenarios**
--------------------

Tab load /Navigate
---------------

 1. **Replace the numbers** :
   On tab load a function in background will be executed it will get the current tab id and the event **chrome.tabs.sendMessage** will be fired which will send the message to the content script, **chrome.runtime.onMessage.addListener** will be fired and will replace the number with a clickable link. 

   It replaces the numbers of the current web page and makes it clickable.
  When the web page is loaded , the background.js send the message to the content.js . 
  Content.js when receives the message it chechks before carrying out the function.
  It carries out a function which scans the current webpage for numbers on a pattern specified by the user through a regular expression.
  It changes all the numbers into clickable and callable links.



Chrome Button Extension
 --------------
 When the chrome extension button is clicked an event **chrome.browserAction.onClicked.addListener** is fired in background.js which executes a function 
 1. **Opening the popup window** 
    On clicking the browser action an event **chrome.browserAction.onClicked.addListener** in background.js will be fired which will execute a function **launchApplication()** it first checks if there is an existing window , if not it opens this window , but if there 
    is an existing window it rejects the call. 

    
Phone number clicked
--------------------
 
 On clicking the link it will extract the value and will send the value as message to the background.js with the new  
 **chrome.extension.sendRequest** event.  **chrome.extension.onRequest.addListener** in background.js will listen to the number and will send the  
 value to popup.js through **chrome.runtime.sendMessage**. Popup.js will have a listener **chrome.runtime.onMessage.addListener** which will 
 listen to the message which has the value sent by background and will store that value and passes the value as argument to **simple.call
 (argument)** to dial the number.

Inbound call
-----------
 When an inbound call comes a **function simple.isConnecting** in popup detects the incoming call and shows the div that displays the caller id, name, asnwer and reject button.
 When answer button is clicked a **function acceptcall** in popup.js is fired which answers the call and similarly for rejection there is a **function endcall** which ends the call.

Transfer Call
-------------
When the call is answered a **function isConnected** in popup is triggered which hides the current div and show a new div which has Hangup,Transfer and send DTMF buttons.When the transfer button is clicked a **function transferTo** is called which takes the extension from the database and shows them in a dropdown. When the user clicks on any extension the value of extension is then stored in a variable which is sent to the call function **simple.call** as an argument for dialing this number.

Dial a number
-----------
A user can dial a number manually by entering the number in input field which has **onblur** listener which will execute function **myFunction**  for taking the written value and storing it in a variable, it then passes it to the function **simple.call** to make a call. When the call button is clicked , it shows a Ringing screen.

* Ringing Screen
  It will check that if there is any **isConnecting** function if yes than it will show the particular div.
  This screen displays the status, the number that is being dialed and an end call button.

* Call Answered
  It will check that if there is any **isConnected** function if yes than it will show the particular div.
  When the call is answered the current div hides and a new div is shown .This div has a Hangup, Transfer,send DTMF button.

* Call Rejected
  It will check that if there is any **isRejected** function if yes than it will show the particular div.
  When the call is rejected the old div is shown.

In Call/Active Call
-----------------
 
* Load contact
   It has a button Load contact which upon clicking executes a function **loadContact** that takes the id of that number, stores it and appends it at the end of URL and redirects to the url which has the information of contact and can update the contact details as well.

* Call Hangup
  This button ends the call on clicking. The end call button has a listener click which when clicked fires a function **simple.hangup()** in popup.js , and it shows the normal screen.

* Send DTMF
  When the call is answered DTMF buttons are displayed. When any of the button is clicked it triggers a function **SendDtmf()** in popup.js which  send the particular number to destination. Each button will have an id and on clicking that button it will trigger click event which will execute another function **session.dtmf(id of button)**.
