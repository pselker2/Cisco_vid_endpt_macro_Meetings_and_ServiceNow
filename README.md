# Cisco video endpoint Macro
### Alert admins to an issue being experienced in a meeting with the option to open a ServiceNow ticket. This solution is designed to run on FedRAMP moderate systems.

## **Overview**

This video endpoint macro enables a user to alert admins in a Webex space that an issue is being experienced by a user.  The meeting types supported are:
- Webex
- Microsoft Teams
- Zoom

When an issue occurs, the user touches the "Meeting Issues" action button on the touch screen.  Then the Meeting issue prompt provides a menu of three problem areas: Audio, Video and Other.  Next prompt is Severity of issue: High, Medium and Low.  User is then prompted for their email address.  Then Meeting type prompt appears: Webex, Microsoft Teams and Zoom. The last prompt provides the option to open a ServiceNow ticket.

All meeting types will alert the admins with a message sent to a Webex space.  If the meeting type is Webex and the ServiceNow option is selected, the following actions occur:

- The Webex meeting number, type and severity of issue, IP address and serial number of the endpoint and the contact email are sent to the Webex space.
- A ServiceNow ticket is open as a Priority 1 and the IP address, Serial Number and software version of the endpoint entered in the Description.
- A message will be sent from ServiceNow to the Webex admin space a with a hyperlink to the ticket and provides instructions on how to start an instant meeting with all users in the space.

Below are instructions on how to enable an environment to execute this demo

---

### **Table of Contents**

- [ServiceNow account and Developer instance](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#servicenow-account-and-developer-instance)
- [Add ServiceNow app from repo to your Dev instance](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#add-servicenow-app-from-repo-to-your-dev-instance)
- [Create Webex Bot for ServiceNow](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#create-webex-bot-for-serviceNow)
- [Add Bot to a Webex space](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#add-bot-to-a-webex-space)
- [Get Webex roomId](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#get-webex-roomid)
- [Add Bot Access Token and roomId to ServiceNow app](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#add-bot-access-token-and-roomid-to-servicenow-app)
- [Validate](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#validate)
- [ServiceNow trouble shooting tips](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#servicenow-trouble-shooting-tips))
- [Create Webex Bot for macro](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#create-webex-bot-for-macro)
- [Add Bot to the same Webex space as previous Bot](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#add-bot-to-the-same-webex-space-as-previoud-bot)
- [Create new macro](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#create-new-macro)
- [Create Action Button](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#create-action-button)
- [Test the macro](https://github.com/pselker2/Cisco_vid_endpt_macro_Meetings_and_ServiceNow/#test-the-macro)

---

### **ServiceNow account and Developer instance**

1. Create an account on [developer.servicenow.com](https://developer.servicenow.com)  
2. Log in and click Start Building
3. Request Instance
    - There are several versions (Choose the most recent instance if no preference)
4. The Dev Instance will open in a new tab
    URL looks like:  https://dev123456.service-now.com/
    
---

### **Add ServiceNow app from repo to your Dev instance**

1. git clone https://github.com/pselker2/IOSXE_Events.git to a public repo like GitHub to enable the ServiceNow Dev instance to access the information
2. ServiceNow All > Studio
    - Select Systems Applications > Studio
    - A new browser tab opens with the Select Application window
    - Select Import From Source Control
    - Use the information from the **new** repo you cloned in step 1
        - URL:  https://github.com/username/repoName.git
        - Credential:  
            - Three step process:
                - Step 1:  create a github developer token (if using github)
                    - Click github avatar in upper right > Settings
                    - Click Developer settings on lower left
                    - Click Personal access tokens
                    - Click Generate new token button
                    - enter user password > Click green "Confirm Password" button
                    - Choose Expiration
                    - Check all scopes
                    - Click green "Generate token" button
                    - copy token
                - Step 2:  Create a credential in ServiceNow
                    - ServiceNow All > Credentials
                    - Click "New" button at top right
                    - Click "Basic Auth Credentials"
                        - Name:  GithubRepo
                        - Username:  your github username
                        - Password:  paste github developer Personal access token
                        - Click "Submit"
                - Step 3:  find the GithubRepo credential
                    - Switch to Studio browser tab
                    - In the Credential box:  find GithubRepo
                    - In the Branch box:  master
                    - Click green "Import" button
                    - Click "Select Application" button
                    - Scroll down and select IOS-XE Alert
    - In the left Studio pane you should see files associated with the IOSXE_Events app
    - On the left side of the Studio pane, click "Cisco Webex Teams Integration" under Outbound Integrations > REST Messages
        - Update the Endpoint
            - From:  https://api.ciscospark.com/v1/messages
            - To:    https://api-usgov.webex.com/v1/messages
        - Click the "Update" button at the upper right.
        - Click "Create Message" at the bottom of the page in the HTTP Methods section
            - Update the Endpoint
                - From:  https://api.ciscospark.com/v1/messages
                - To:    https://api-usgov.webex.com/v1/messages
        - Click the "Update" button at the upper right.
        
---

### **Create Webex Bot for ServiceNow**

1. Log in on [developer-usgov.webex.com](https://developer-usgov.webex.com) with a FedRAMP Webex account
2. Click on the "Build Apps" button
3. Click on the "Create a New App" button
4. Click on "Create a Bot" button
5. Fill in the information and click the "Add Bot" button at the bottom of the page
6. Save the "Bot's Access Token" in a safe place

---

### **Add Bot to a Webex space**

1. Create a space for testing the Bot you just created
2. Add your new Bot to the space
    - Go to the space
    - Click People
    - Click Add people
    - Type the Bot Username (example@webex.bot)
    
---

### **Get Webex roomId**

1. Log in on [developer-usgov.webex.com](https://https://developer-usgov.webex.com)
2. Click on the "Documentation" 
3. Click on "Full API Reference" on the left side under **APIs**
4. Click on "Teams" on the left side
5. Click on the Get Method url with the Description List Teams
6. Click the yellow "Run" button on the right side
    - All the Teams you are in will be listed in the response section
    - Copy the "id" of the Team that contains the space with your Bot
7. Click on "Rooms" on the left side
8. Under "Method" click on the Get url to "List Rooms"
    - On the right under "Query Parameters"
        - Paste the "id" of the Team from step 6 into the "teamId" Query Parameter
        - Click the yellow "Run" button on the right side
        - Copy the "id" of the Room that contains your Bot

---

### **Add Bot Access Token and roomId to ServiceNow app**

1. ServiceNow Studio browser tab
    - Click on "SNOW Bot for Webex Teams" in the left pane under "Business Rules"
    - Right pane click "Advanced" tab
    - Replace the roomId in line 19 of the script with your roomId you found in the previous section. (roomId in the cloned script looks like 'Y2lzY29...ZTNk')
    - Three changes are needed to line 14
        - Change 1
            - From:  pselker@cisco.com
            - To:    your FedRAMP email
        - Change 2
            - From:  router HRN57 CRITICAL failure
            - To:    Meeting issue reported
        - Change 3
            - From:  dev76181
            - To:    your dev instance.  (listed in the browser url)
    - Click the "disk" icon to save the script changes
    - Click the "Update" button in upper right
2. ServiceNow Studio browser tab
    - Click on "Cisco Webex Teams Integration" in the left pane under "REST Messages"
    - Click on the "HTTP Request" tab in the right pane
    - Click the "Authorization" link in the right pane
    - In the "value" box replace only the Bot access token that looks like NWViY...e10f with the access token of the Bot you created in the "Create Webex Bot for ServiceNow" section
    - Click the "Update" button in the upper right 
    
---

### **Validate**

1. In the browser tab (not Studio) ServiceNow All > type "IOSXE-Events"
    - You should see IOSXE-Events table
    - Click the "New" icon
    - Click "Submit" button in upper right
    - You should see that a record was created in the right pane
    - You should also have a message in your Webex Teams space from the BOT in ServiceNow that provides the information you just entered in the ServiceNow form
    
---

### **ServiceNow trouble shooting tips**

1. In ServiceNow All >
    - Find/Search window 
        - Type System Log
            - View Script Log Statements
            - View Application Logs

---

### **Create Webex Bot for macro**

1. Log in on [developer-usgov.webex.com](https://https://developer-usgov.webex.com)
2. Click on the "Build Apps" button
3. Click on the "Create a New App" button
4. Click on "Create a Bot" button
5. Fill in the information and click the "Add Bot" button at the bottom of the page
6. Save the "Bot's Access Token" in a safe place

---

### **Add Bot to the same Webex space as previous Bot**

1. Add your new Bot to the space
    - Go to the space
    - Click People
    - Click Add people
    - Type the Bot Username (example2@webex.bot)
    
---

### **Create new macro**

1. Login to the Device Web Portal for the video endpoint via the control hub
2. Ensure the HTTPClient mode is enabled on the endpoint
    - On the left side, click Settings
    - On the right side click HTTPClient
        - Verify Mode is set to On.  (If you toggle from off to on make sure you click save)
2. On the left side, click on the Macro Editor
3. Click on Create new macro
4. Click on "Untitled1" name and change it to MtgIssues
5. Download the meetingIssue.js file from the repository
6. Copy and paste the contents of meetingIssue.js into the MtgIssues Macro
7. Update the following lines in the macro on the endpoint
    - Line 13 update the token value to the Bot token you created in "Create Webex Bot for macro" section above
        - From:  NGMyM...12f
        - To:    your new Bot token
    - Line 14 update the roomId
        - From: NGMy...YzQ
        - To:   The roomId you captured in "Get Webex roomId" section
    - Line 15 update the SNOWinstance with your dev instance
        - From:  https://dev125866.service-now.com
        - To:    https://devXXXXXX.service-now.com where XXXXXX is your instance
    - Line 18 Create your SNOWuserNamePWDbase64
        - From:  YWRta...Wg==
        - To:    Follow instruction in the comment on line 18 
            - username is admin
           -  password can be found by clicking your icon on SNOW login page, then click "Manage instance password" and the password is displayed
8. Save the file

---

### **Create Action Button**

1. Go to the Home admin screen
2. On the left side,Click on UI Extensions Editor
3. Click the New button
4. Click the + Add button under "Action Button"
5. On the right side
    - Id = whichMeeting
    - Name = Meeting Issue
    - Button visibility = Always
    - Icon can be any choice
    - Extension button color can be any choice
6. Top right click the "Export configuration to video system" button
    
---

### **Test the macro**

1. The Meeting Issue button should be on the Navigator or touch screen display
2. Touch the button
