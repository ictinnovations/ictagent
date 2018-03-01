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
6. Options html
7. Popup_gui



Popup Roles and responsibilites
-------------------------------
Popup has following components:
1. Popup.html
2. Popup.js

### Popup.html
Popup.html has several screen which will be displayed depending on their condition.

**Screen Idle**  
Its the very first screen that appears when the user clicks on the browser action i.e on the icon of the extension in toolbar.It has calling functionality. User can dial any number from this screen. 

**Screen Outgoing**  
This screen appears when a user dials a number and clicks on the call button.It has an end call button.

**Screen Incoming**  
When the inbound calls come this screen appears , it will have a feature of answering and rejecting it. 

**Screen incall**  
This screen will be displayed when an inbound call is answered .It has Reject, Transfer,Send DTMF buttons. 

### Popup.js
Popup.js is a javascript file that has been integrated with the popup.html. All the buttons in html file perform some task and instructions of carrying that task is given in popup.js. In this case it has all the call related functions like accept ,reject, end,transfer, and send  DTMF.

**Functions**  

1. GetUserMedia
2. Setup_popup
3. readvalues
4. getListItems
5. load_contact
6. Chrome.runtime.onMessage.addListener which listens to the value sent as message by background stores the value and passes that value to the call function as an argument, which dials the number.
7. It gets the value of **contact load Url** from chrome storage and stores it in a global variable for further processing.
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
    "default_title": "ICT Agent"
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
 
Popup_gui.js Responsibilities
-------------------
Popup_gui.js is a javascript file that controls the GUI of the popup and shows the respective screen based on the condition. It is integrated with popup.html. In this case it has all the call related functions like accept ,reject, end,transfer, and send  DTMF. Whenever any of the phone tool is pressed a function in the popup-gui.js is triggered which controls the operation of GUI.

### Functions

1. **OpenModal**: When the DOMContentLoaded it call the function openModal which sets the targetActivity idle and shows the Idle screen to the user.
2. **ChangeStatusIndicator**: This function toggles the agent status i.e online and offline.
3. **closeModal**: This function checks that if the currentActivity is idle and the clientStatus is offline, if yes than it calls another function action_close which in turn closes the popup window.
4. **ChangeActivity(methodCaller, actionName)**: This function changes the activity based on the methodCaller and the action button pressed.
5. **CloseIncalltools**: When user closes the transfer tools or dtmf tools than this function is executed which closes the incall tools. OR when the call is ended this function executes which closes all incall tools.
6. **OpenIncalltools**: When the call is answered and if the user presses the transfer or DTMF button it opens the respective tools.
7. **update_extension_list(aExtension)** : When the result of getListItem is successfull than it triggers this function which creates the options of dropdown.
8. **action_answer**: This function answers the inbound call.
9. **action_hangup**: If the targetActivity is idle this function is executed which hang up the call.
10. **action_transfer**: When the start transfer call button is clicked this function executes and transfers the call to the extension selected.
11. **action_dtmf**: When user presses any DTMF key this function executes which sends the DTMF to the remote site.
12. **dial_a_number**: When user clicks on any number than this function triggers which sends the value of the number clicked as argument to the dial_a_number function, which calls a function **changeActivity(callUncallButton, start)** which changes the targetActivity outgoing and makes the call to the number.
13. **event_incomming**: On incoming call this function is executed which in turn asks the changeActivity to set the methodCaller eventRingingInbound and change the targetActivity to incoming and show the respective screen.
14. **event_answer**: When the call is connected this function is triggered, which calls the function changeActivity to set the methodCaller to **eventCallAnswered**, so the targetActivity is set as incall and incall screen is shown to the user.
15. **event_hangup**: When the call is ended this function is triggered, which checks that if the targetActivity is not idle than close all the incall tools and calls the function **changeActivity(callUncallButton, stop)** which changes the targetActivity to idle and show the idle screen to the user.
16. **numpadPress**: During Screen Idle when user enters the number this function is executed which takes the value of the button and sets the idle screen value to the number entered.
17. During incall activity when the DTMF button is pressed an event in the popup_gui.js is triggered which takes the value of the button pressed in the variable and call the action_dtmf to send the number pressed as DTMF.
18. During incall activity when the number label is clicked an event in the popup_gui.js is triggered which calls the function action_load_contact
which takes the number and loads the particular contact details.
19. During outgoing activity when the number label is clicked an event in the popup_gui.js is triggered which calls the function action_load_contact which takes the number and loads the particular contact details.
20. During incoming activity when the number label is clicked an event in the popup_gui.js is triggered which calls the function action_load_contact which takes the number and loads the particular contact details. 

Scenarios
---------

### Right click the extension

On right click it will show the following options:
   
1. Search phone number
   
   When this menu is clicked, it has a onclick listener which listens to the onClick event and it gets the current tab id and the event
   **chrome.tabs.sendMessage** will be fired which will send the message to the content script, which will listen to the message through
   listener **chrome.runtime.onMessage.addListener** and will replace the number with a clickable link.
   
2. Settings
   
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
On clicking the browser action an event **chrome.browserAction.onClicked.addListener** in background.js will be fired which will execute a funtion **launchApplication()** it first checks if there is an existing window , if not it opens this window , but if there is an existing window it does not open the window. 

    
### Phone number clicked
On clicking the link it will extract the value and will send the value as message to the background.js with the new **chrome.extension.sendRequest** event.  **chrome.extension.onRequest.addListener** in background.js will listen to the number and will send the value to popup.js through **chrome.runtime.sendMessage**. Popup.js will have a listener **chrome.runtime.onMessage.addListener** which will listen to the message which has the value sent by background and will store that value and passes the value as argument to the **dial_a_number(res)** function to dial the number, which in turn dials the number.

### Inbound call
When an inbound call comes a **function simple.on("ringing")** in popup detects the incoming call, gets the caller name and number from the session_variable and calls the function event_incoming(caller number, caller name), which changes the method Caller to the eventRingingInbound which sets the targetActivity to the incoming and shows the incoming screen to the user.

If the answer button is clicked, it will change the targetActivity to the incall ans will change the screen and also it will call a function **action_answer** in popup_gui.js which will answer the call.

If the reject button is clicked it will set the targetActivity idle and will change the screen and also it will call the function **action_hangup** which detects the call status i.e in case of ringing its status is **new** so it wil reject the call.

### Transfer Call
When the call is answered it shows **incall** screen which has Hangup,Transfer and send DTMF buttons. When the transfer button is clicked it will show the transfer dropdown. When the **Start Transfer Call** button is clicked, an event in the popup_gui.js is fired which takes the value of selected Extension and calls another function **action-transfer** which transfers the call to the selected Extension.

### Dial a number
A user can dial a number manually by entering the number in input field. When the call button is clicked, it has an event Listener which will take the value of the number and will call the function **changeActivity('callUncallButton')** which detects that if the oldActivity is idle than it makes call to the number and change the targetActivity to the outgoing and also changes the screen. 

### Call Answered
On incoming call, if the answer button is clicked, it will change the targetActivity to the incall ans will change the screen and also it will call a function **action_answer** in popup_gui.js which will answer the call.

### Call Rejected
On incoming call, if the reject button is clicked it will set the targetActivity idle and will change the screen and also it will call the function **action_hangup** which detects the call status i.e in case of ringing its status is **new** so it wil reject the call.

### Event Hangup

When the call is ended from the remote site a function simple.on("ended") fires in the popup.js which calls a function **event_hangup** in the popup_gui.js which checks if the targetActivity is not idle than close all dtmf and transfer tools, changeActivity action to the stop and displays the idle screen.

### Event Answered

When the call is answered from the remote site a function simple.on("connected") is fired in popup.js which calls a function **event_answer** in the popup_gui.js calls the function changeActivity('eventCallAnswered') and changes the targetActivity as incall and shows the incall screen.

### In Call/Active Call
 
* **Load contact:**  
When the call is answered, by clicking on the number label it will show the particular contact details.

* **Call Hangup:**  
This button ends the call on clicking. When this button is clicked it will change the targetActivity to the idle and will show the idle screen and it will also call another function **action_hangup** which ends the call.

* **Send DTMF:**  
When the call is answered it has a send DTMF option, when user clicks this it will show the button, click the button you want to send as DTMF. When any of the button is clicked an event in the popup_gui.js is fired which gets the value of the button clicked and passes the value as an argument to the **action-dtmf** function which in turns sends the DTMF.

### How to package the Source Code

For publishing the extension, firstly zip the folder than
* Navigate to the [Chrome Web Store](https://chrome.google.com/webstore).
* Go to the Developer Dashboard.
* click add new Item.
* Upload the source code.
* Fill in all the fields.
* For fisrt time pay the developer fee of $5.
* Hit the publish button.
The Extension will be published.
