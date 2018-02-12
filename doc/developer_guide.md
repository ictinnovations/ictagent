WebRTC based phone Extension
============================
This extension will embed WebRTC based Voip phone in browser, this phone will remain connected to the main server and will be responsible for inbound,outbound,transfer calling as well as for sending DTMF.

This extension has following components:

1. Popup
2. Popup html
3. Background
4. Content
5. Manifest
5. Options page


Popup Roles and responsibilites
-------------------------------
Popup has following components:
1. Popup.html
2. Popup.js

### Popup.html
Popup.html has several divs which will be displayed depending on their condition.

**Screen Normal**  
Its the very first screen that appears when the user clicks on the browser action i.e on the icon of the extension in toolbar.It has calling functionality. User can dial any number from this screen. (div#screennormal)

**Screen Dialing**  
This screen appears when a user dials a number and clicks on the call button.It has an end call button.(div#screendialing)|

**Screen Ringing**  
When the inbound calls come this screen appears , it will have a feature of answering and rejecting it. (div#screenringing)

**Screen Calling**  
This screen will be displayed when an inbound call is answered .It has Reject, Transfer,Send DTMF buttons. (div#screencalling)

### Popup.js
Popup is a javascript file that has been integrated with the popup.html. All the buttons in html file perform some task and instructions of carrying that task is given in popup.js.In this case it has all the call related functions like accept ,reject, end,transfer, and send  DTMF.

**Functions**  

1. GetUserMedia
2. Call
3. Answer
4. End
5. Transfer
6. SendDTMF
7. Chrome.runtime.onMessage.addListener which listens to the value sent as message by background stores the value and passes that value to the call function as an argument, which dials the number.
8. It gets the value of **contact load Url** from chrome storage and stores it in a global variable for further processing.
---

Background responsibilities and functions
-----------------------------------------
Background is a javascript file that has the code which controls the behaviour of extension, and performs various functions upon clicking the extension.This page runs in an isolated environment therefore it uses message passing to interact with content and popup.Google has provided APIs for message passing, Live connections have been used as well for the interaction.

### Functions
1. chrome.tabs.onUpdated.addListener has function getTab() which gets the tab id of current web page and sends the messaeg to content script. 
2. Browser action has a function launchApplication() which monitors that if window is open it prevents more windows from opening , and if no window is open it opens a new window. 
3. chrome.extension.onRequest.addListener listens to the message sent by the content which is the number to be called. It takes the number, stores it and sends the request to the popup and sends the number as an argument.
4. It creates the menu for the user i.e Default, settings and Search phone number.
5. It creates the extension menu with the following command **chrome.contextMenus.create** and whenever user clicks the menu it triggers an onclick event.
6. It takes the value of the checkbox search phone number from the storage and stores it in global variable **searchit**.
7. It has a function **Chrome.tabs.OnUpdated** listener which is executed when the tab is updated and gets the tab Id and send the message to the content script to search phone numbers on the current tab, if the value of the **searchit** is 1.
8. It takes the value of the checkbox autoload widget popup and executes the function to load it if and only if the value of checkbox is greater than 1.

Content Responsibilites
--------------------
If an extension wants to alter the web page no file other than content.js has access for altering this page.It can interact with background.js through message passing.

### Functions
1. It gets the value of regex from the storage and matches the number with that particular regex.
2. Chrome.runtime.sendMessage.addListener which listens to the message sent by the background and executes the functions which executes the  functions and replaces the number with a clickable links.
3. Onclicking the link it will take the value and will save it in variable.
4. Chrome.extension.sendRequest sends the stored value as an argument to the background.

Manifest Responsibilities
--------------------
Manifest file is in JSON format. Using manifest.json we specify basic metadata about extension such as the name and version, and can also specify aspects of extension's functionality, such as background scripts, content scripts, and browser actions, permissions like tabs as background can access the tab data to alter its content. It will ask for the permissions of **activeTab** to fetch the current tab data.
1. **"background"**: {
    "persistent": true,
    "scripts": ["jquery-2.2.0.min.js","background.js"]
  },
2.  **"browser_action"**: {
    "default_title": "AAA Extension"
  },
3.  **"content_scripts"**: [{
    "matches": ["<all_urls>"],
    "js": ["jquery-2.2.0.min.js","content.js"]
  }],
4. **"permissions"**: ["activeTab", "storage"]

We need to define that which page will act as background and also if it depends on any library we need to mention that in script. A content script to declare which file will act as content, and the permission that are required by the extension.

Options Responsibilities
-----------------------
This is a setting page which detects the settings and saves them in the **Chrome Storage**. It asks for the following parametes from the user:
**Api Server**
  * Username
  * Password
  * Url
  * Test button
**Agent**
  * Get the Extenison
  * Reload Button
  * Auto load checkbox
**Phone numbers**
  * Search Phone on new tabs
  * Phone pattern
**Contact Load**
  * Contact Load Url

### Functions
1. When user enters the url it has onChange listener which gets the value of url and authenticate user with that url.
2. When user leaves the username field it takes its value with onChange listener and stores the value and sets the value in chrome storage.
3. When user leaves the password field it takes its value with onChange listener and stores the value and sets the value in chrome storage.
4. It then takes the value from storage and creates header and then authenticates user with the url specified by the user. If the Login is
   successful it than stores the token for further processing.
5. When user clicks the Reload button it creates the authorization header with the value stored in the storage and displays the extensions
   of particular user. When user selects the extension it takes it value and stores it in the chrome.storage.
6. It takes the value of the regex from the user and then stores it in the chrome storage.
7. It takes the value of the Contact Load Url from the user and then stores it in the chrome storage.
8. It has a checkbox as to search the phone number on new tab, if checked it stores 1 in storage else 0.


Chrome Buttons/Actions
--------------------
When a user clicks on the browser action i.e extension icon specific functions are performed like it open the popup window by executing the function. On clicking the browser action an event **chrome.browserAction.onClicked.addListener** in background.js will be fired which will execute
a function **launchApplication()** it first checks if there is an existing window , if not it opens this window , but if there is an existing window it rejects the call. 

Settings
--------
When user right click on the extension icon it open the settings page which consist of :

**Authentication**  
It takes the credentials from user and on the basis of that authentication result it lets the user use WebRTC phone.
 * **Api Server**
 It takes following parameters from the user:
 1. Url
 2. Username
 3. Password
 4. Test
 * **Agent**
 1. Select Extension
 2. Auto load Checkbox
 * **Phone numbers**
 1. Search Phone numbers on new tabs Checkbox
 2. Phone Pattern
 * **Contact Load**
 1. Contact Load Url
 
 
Scenarios
---------

### Right click the extension

On right click it will show the following options:

1. Default
   
   When this menu is clicked, it has a onclick listener which listens to the onClick event and open the popup window if no window is open.
   
2. Search phone number
   
   When this menu is clicked, it has a onclick listener which listens to the onClick event and it gets the current tab id and the event
   **chrome.tabs.sendMessage** will be fired which will send the message to the content script, which will listen to the message through
   listener **chrome.runtime.onMessage.addListener** and will replace the number with a clickable link.
   
3. Settings
   
    This is a redirect menu which redirects the user to the settings page, i.e option page and ask for the extension settings.
    

### Tab load /Navigate


* **Replace the numbers:**  
On tab load a function in background will be executed it will get the current tab id and the event **chrome.tabs.sendMessage** will be fired which will send the message to the content script, **chrome.runtime.onMessage.addListener** will be fired and will replace the number with a clickable link. 

It replaces the numbers of the current web page and makes it clickable.
When the web page is loaded , the background.js send the message to the content.js . 
Content.js when receives the message it chechks before carrying out the function.
It carries out a function which scans the current webpage for numbers on a pattern specified by the user through a regular expression.
It changes all the numbers into clickable and callable links.


### Chrome Button Extension
When the chrome extension button is clicked an event **chrome.browserAction.onClicked.addListener** is fired in background.js which executes a function 

### Opening the popup window
On clicking the browser action an event **chrome.browserAction.onClicked.addListener** in background.js will be fired which will execute a funtion **launchApplication()** it first checks if there is an existing window , if not it opens this window , but if there is an existing window it rejects the call. 

    
### Phone number clicked
On clicking the link it will extract the value and will send the value as message to the background.js with the new **chrome.extension.sendRequest** event.  **chrome.extension.onRequest.addListener** in background.js will listen to the number and will send the value to popup.js through **chrome.runtime.sendMessage**. Popup.js will have a listener **chrome.runtime.onMessage.addListener** which will listen to the message which has the value sent by background and will store that value and passes the value as argument to **simple.call (argument)** to dial the number.

### Inbound call
When an inbound call comes a **function simple.isConnecting** in popup detects the incoming call and shows the div that displays the caller id, name, asnwer and reject button.

When answer button is clicked a **function acceptcall** in popup.js is fired which answers the call and similarly for rejection there is a **function endcall** which ends the call.

### Transfer Call
When the call is answered a **function isConnected** in popup is triggered which hides the current div and show a new div which has Hangup,Transfer and send DTMF buttons.When the transfer button is clicked a **function transferTo** is called which takes the extension from the database and shows them in a dropdown. When the user clicks on any extension the value of extension is then stored in a variable which is sent to the call function **simple.call** as an argument for dialing this number.

### Dial a number
A user can dial a number manually by entering the number in input field which has **onblur** listener which will execute function **myFunction** for taking the written value and storing it in a variable, it then passes it to the function **simple.call** to make a call. When the call button is clicked, it shows a Ringing screen.

### Ringing Screen
It will check that if there is any **isConnecting** function if yes than it will show the particular div. This screen displays the status, the number that is being dialed and an end call button.

### Call Answered
It will check that if there is any **isConnected** function if yes than it will show the particular div. When the call is answered the current div hides and a new div is shown .This div has a Hangup, Transfer,send DTMF button.

### Call Rejected
It will check that if there is any **isRejected** function if yes than it will show the particular div. When the call is rejected the old div is shown.

### In Call/Active Call
 
* **Load contact:**  
When call is connected it takes the value of the remote ID and replaces the **url** with the remoteId. 

* **Call Hangup:**  
This button ends the call on clicking. The end call button has a listener click which when clicked fires a function **simple.hangup()** in popup.js, and it shows the normal screen.

* **Send DTMF:**  
When the call is answered DTMF buttons are displayed. When any of the button is clicked it triggers a function **SendDtmf()** in popup.js whic send the particular number to destination. Each button will have an id and on clicking that button it will trigger click event which will execute another function **session.dtmf(id of button)**.