## ICTAgent(Browser Extension)

ICTAgent is browser extesion that will work with all popular browers like chrome , firefox etc and it will make all available contacts click2dial.  This extension will embed WebRTC based VoIP Phone in browser which will remain connected to the main server, and will be responsible for inbound and outbound calls, transfer calls, sending DTMF as well sending Fax. It can harvest contacts from the random pages. Agent can access contents, contacts from a single application. Browser can automatically fetch required URL depending on the course of call. Automatic URL will eliminate any delay which agent take while searching and finding desired data.

It has Click 2 Call feature, User can click on the number to make call. 

It allows to send fax, view received fax, add the document. You can also view the sent faxes through this.


### Features of ICT Agent(Browser Extension)

- An Embedded Web Phone.
- It is Operating System Independent, we just need a browser.
- Click 2 Call.
- Agent can access contents, contacts and communications from a single application(browser).
- It will make agent performance much better.
- It can harvest contacts from random pages / websites/ web applications.
- CRM Integration.
- Inbound and Outbound Calls.
- Call Transfer.
- Send DTMF.
- Load contact information of incoming and outgoing caller
- Search for the desired Phone pattern
- Authentication
- Agent Login/Logoff
- Add Document
- Send Fax
- View Sent Fax
- View Received Fax
- Download Fax Document


Installation
---------------------
- Open the [Chrome Web Store](https://chrome.google.com/webstore).
- Search for the **ICT Agent** Extension in the google web store.
- Click **Add to Chrome**.
- A box will open that lists the data that the extension will be able to access.
- Click **Add Extension** to grant the extension access to your data and install the extension.
- Extension will be installed.

- To use the extension click the icon to the right of address bar in chrome.

Extension Settings
------------------
Once the extension is successfully installed, update the extension settings for this:
- Right click on the extension icon.
- A menu will appear like **Search Phone numbers**, **Options**.
- Click **Options**.
- It will redirect you to the Settings page.

### Authentication

  Enter the Url of communication server i.e Api Url, Username and Password, Test Credentials button. Click the Test Credential button to test your credentials. If all of these fields are valid then a success message will appear and the extensions will be automatically updated.
  If an error message displays then again fill the required fields with correct credentials.
  
### Select Extension  
  To get the updated list of extensions click the Refresh button it will load the extensions.
  Select the Extension.
  Now all inbound and outbound calls will be handled through this Extension.
  
### Enter URL to load information of incoming and outgoing caller
  
  Enter Url to load caller information i.e the URL of the Customer Relationship management(CRM), so that when the call is connected it will load the particular contact details.
  
### Pattern to search phone number in web pages

  Enter Phone Regular Expression to match the Phone pattern on the webpage. So that when you search the phone number it will scan the whole web page and will find the numbers that match the phone pattern given as input and will convert all that numbers into the link.
  
### Search Phone on new web page

  If you want to search/scan phone number automatically on the web page, then select the Checkbox.
  
### Automatically open the Phone widget when user click on phone number
  
  If you want to auto load the popup window, upon clicking the phone number then enable the checkbox.

Scan Phone number
-----------------
You can scan/search Phone numbers by Enabling the **Search Phone on the new web page checkbox** in the **Options** page.

If you want to manually search the phone number on the desired page then you can simply achieve by following these steps:

* Right click the Extension icon.
* Click **Search Phone Number in current Tab**
* It will highlight all the numbres on the page and will make all the numbers clickable.

Open the Web Phone / Popup
--------------------------
- To open the web phone click on the extension icon, it will open the Web Phone Window.
- Enable the checkbox **Automatically open the Phone widget** in options/settings page it will automatically open the Popup window when the number is clicked.

<div style="page-break-after: always;"></div>

Menu
------
There are two menus

* **Call**

  Through call menu the user can manage the inbound and outbound calls, send DTMF and transfer the calls.
  
  User has both option either click to call or agent has also numeric keypad to dial any contact manually , the said contact will be saved  for future use, during call progress, the agent will have option to accept , reject, send DTMF  or  transfer the call to any available agent
  
  <div style="text-align: center"><img src="doc/activity1.png"/></div>
  
* **Fax**
  
  Through Fax menu the user can manage the inbound and outbound Fax, send fax to a particular number, add the documents as well.
  
    <div style="text-align: center"><img src="doc/fax_menu.png"/></div>

Make a Call
-----------
- To Call the specific number open the **Popup / Phone** Window.
- Enter the number in the input field.
- Click the **Call** button.

<br><br>

<div style="text-align: center"><img src="doc/activity1.png"/></div>

<div style="page-break-after: always;"></div>

Outgoing Call
------------

On outgoing call following screen will display

<br><br>

<div style="text-align: center"><img src="doc/activity2.png"/></div>

<div style="page-break-after: always"></div>

Click 2 Call
------------
To enable Click 2 Call, enable **automatically open the Phone widget** checkbox. Search Phone number and by clicking any number in the web page Phone window will automatically open and will forward the call to the number clicked. OR If the checkbox is not enabled, you can still use this feature by manually opening the Phone window through extension icon in chrome and by clicking the number it will forward call to the number clicked.

Answer an inbound Call
----------------------
To answer an inbound Call the **Phone / Popup** must be open. On incoming call it will show the Caller name and accept and reject button. To answer the Call Click the **Accept** button and if you want to reject the Call then click the **Reject** button.

You can also open the caller details by clicking the number on the incoming call screen.

<br><br>

<div style="text-align: center"><img src="doc/activity3.png"/></div>

<div style="page-break-after: always;"></div>


Send DTMF or Transfer
--------------------
When the call is connected, it has the options to both send DTMF or Transfer Call.

<br><br><br>

<div style="text-align: center"><img src="doc/activity4.png"/></div>

<div style="page-break-after: always;"></div>


### Send DTMF

During surveys and polls when the caller asks you to press the specific key you can use send DTMF buttons to send your response.
When the Call is connected, click the send DTMF button, it will open the keypad, click the button in keypad you want to send as DTMF.

<br><br><br>

<div style="text-align: center"><img src="doc/activity4.2.png"/></div>

<div style="page-break-after: always;"></div>


### Transfer Call

When the call is connected simply click the Transfer to button, a dropdown or a list of agent will appear, select the agent and click the start transfer call and the call will be connected to the agent/extension selected.

<br><br>


<div style="text-align: center"><img src="doc/activity4.1.png"/></div>

<br><br>

Load the Contact Information
--------------------------
To load the Contact information enter the CRM url in the **Options** page which will load the partciular contact when the call is either connecting or connected. Click the number and it will load the particular contact details.

During Outgoing, incoming and in call click the number label and it will load the particular contact details.

Send Fax
--------

To send the fax to a particular contact switch to the Fax menu and click on the **Send new fax**. You will see the following interface

<div style="text-align: center"><img src="doc/send_fax.png"/></div>

Here enter title, choose document to sent, select the destination number on which you want to send the fax and press submit button.

It will redirect you to the Outbound fax list and the user can see the status of the fax there.

Add Document
------------

To add the new document to the ictfax, firstly open the Fax menu and click on the **Add new document**. You will see the following interface

<div style="text-align: center"><img src="doc/add_document.png"/></div>

Here enter the details and click the submit button. New Document will be added successfully

Outbound Fax
-----------

To see the outbound fax list , open the fax menu and click on the **View Sent Fax**. It will show you the list of all sent faxes


Inbound Fax
-----------

To see the list of received fax, open the fax menu and click on the **View Received Fax**. It will show you the list of all received faxes

Here you can also download the fax document sent by the user.

NOTE
-----

Currently ICTAgent supports fax and voice and we have plans to add SMS and WhatsApp functionality soon.

### Credits

ICTAgent is developed by [ICT Innovations](http://www.ictinnovations.com/) and it has been tested with [ICTCRM](https://github.com/ictinnovations/ictcrm/) and [ICTCore](http://www.ictcore.org/)


