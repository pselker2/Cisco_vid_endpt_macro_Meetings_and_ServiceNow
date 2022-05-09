////////////////////////////////////////////////////////////////////////////
// This macro will enable a video endpoint meeting participant to alert    /
// an individual admin or a Webex space with serveral admins that an issue / 
// has occured and provide a meeting number to allow the admin to start    /
// troubleshooting immediately.  It also provides the ability to create    /
// a ServiceNow ticket on the issue.                                       /
////////////////////////////////////////////////////////////////////////////

import xapi from 'xapi';

// Initial values
const webexMsgUrl = 'https://api-usgov.webex.com/v1/messages'; //FedRAMP API endpoint
const token = 'NGMyMWI2MDctM2VjZC00YjBmLTk5YzItYmExMjBhNmFjNzBiY2E2NWRhNWQtNWQ1_FC82_37a1930e-1a4d-4101-84e9-13727649912f'; //Bot token
const roomId = 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWdvdi13ZXN0LTFfYTEvUk9PTS80ZWZmNGU1MC1hMjBhLTExZWMtYmVjZS1mZDY1OGUxZGZlYzQ';
const SNOWinstance = 'https://dev125866.service-now.com';  //This is a developer instance
const SNOWtable = 'x_305159_ios_xe_al_iosxe_events';
const SNOWinstanceANDtable = SNOWinstance + '/api/now/v1/table/' + SNOWtable;
const SNOWuserNamePWDbase64 = 'YWRtaW46YWV0QTl3UUNvTUpEYjNzWg=='; //Format is "username:password" for basic Authorization. This needs to be base64-encoded. Use e.g. https://www.base64encode.org/ to do this
let IPaddress = '1.1.1.1';
let SoftwareVersion = '10';
let HWserialNum = '10';
let adminMessage = 'Alert: Issue with Webex Meeting';
let avoResponse = 'video';
let sevResponse = 'Medium';
let mtype = 'Webex';
let mnum = '12';
let DevId = 'deviceId';
let emailaddr = 'jones@example.com';

// Send a message to a Webex room/space
function sendMessage(token, roomId, msgToSpace) {
    const headers = [
      'Content-Type: application/json',
      'Authorization: Bearer ' + token,
    ];
  
    const body = {
        roomId: roomId,
        markdown: msgToSpace,
    };
   
    console.log("Stringify:" + JSON.stringify(body));  //Debug  
    xapi.Command.HttpClient.Post({ Header: headers, Url: webexMsgUrl }, JSON.stringify(body));
};

// Get endpoint information
(async function getEndptInfo(){
    SoftwareVersion = await xapi.Status.SystemUnit.Software.Version.get();
    console.log('SoftwareVersion: ' + SoftwareVersion); //Debug
    
    IPaddress = await xapi.Status.Network[1].IPv4.Address.get();
    console.log('IPaddress: ' + IPaddress);  //Debug

    HWserialNum = await xapi.Status.SystemUnit.Hardware.Module.SerialNumber.get();
    console.log('Serial Number: ' + HWserialNum); //Debug

    DevId = await xapi.Status.Webex.DeveloperId.get();
    console.log('DevId:' + DevId); // Debug

})();

// Get far end of endpoint call
async function callInfo(){
   try {
    mnum = await xapi.Status.Call.CallbackNumber.get();
    console.log('mnum: ' + mnum);
   } catch (error){
       console.error(error);
   }
};   


// If the action button "Meeting Issue" on the home screen is pressed a menu will appear
xapi.Event.UserInterface.Extensions.Panel.Clicked.on((event) => {
    if (event.PanelId === 'whichMeeting') {
        console.log('Meeting Issue button press ack'); //Debug
        xapi.Command.UserInterface.Message.Prompt.Display({ 
            Title: "Meeting issue"
          , Text: 'Please select the problem area.'
          , FeedbackId: 'roomfeedback_step1'
          , 'Option.1':'Audio'
          , 'Option.2':'Video'
          , 'Option.3':'Other'
        });
    }
});

xapi.Event.UserInterface.Message.Prompt.Response.on((event) => {
    switch(event.FeedbackId){
        
        case 'roomfeedback_step1':
            switch(event.OptionId){
                
                case '1':
                    avoResponse = 'an AUDIO issue!';
                    break;
                case '2':
                    avoResponse = 'a VIDEO issue!';
                    break;
                case '3':
                    avoResponse = 'an UNKNOWN issue!';
                    break;
            }
            console.log ('In roomfeedback_step1 :' + avoResponse); //Debug
            // Get meeting number from the endpoint
            callInfo();

            // Severity of issue
            xapi.Command.UserInterface.Message.Prompt.Display({ 
                Text: 'Severity of issue?',
                FeedbackId: 'roomfeedback_step2',
                'Option.1':'High',
                'Option.2':'Medium',
                'Option.3':'Low'
            });
            break;

        case 'roomfeedback_step2':
            switch(event.OptionId){
                
                case '1':
                    sevResponse = 'High';
                    break;
                case '2':
                    sevResponse = 'Medium';
                    break;
                case '3':
                    sevResponse = 'Low';
                    break;
                }

            xapi.Command.UserInterface.Message.TextInput.Display({
                InputType: 'SingleLine',
                FeedbackId: 'roomfeedback_step3',
                Placeholder: 'Email Address', 
                Title: 'Please enter your Email Address.',
                Text: 'Email Address',
                SubmitText: 'Next',
                });
        
            console.log ('In roomfeedback_step2 :' + sevResponse); //Debug
            break;
        
        case 'roomfeedback_step4':
            xapi.Command.UserInterface.Message.Prompt.Clear({ FeedbackId: 'roomfeedback2' }); 
            switch(event.OptionId){
                
                case '1':
                    
                    // Call send message for Webex
                    mtype = 'Webex';
                    adminMessage = 'Alert: Webex Meeting Number ' + mnum + ' \r\n reported with ' + avoResponse + ' Severity: ' + sevResponse + '\r\n IP address: ' + IPaddress + '\r\n Serial Number: ' + HWserialNum + '\r\n Contact Email address: ' + emailaddr;
                    sendMessage(token, roomId, adminMessage);
                    console.log('End of WebexMtg case'); //Debug
                    break;

                case '2':
                    
                    // call send message for MS Teams
                    mtype = 'MS Teams';
                    adminMessage = 'Alert: MS Teams Meeting reported with ' + avoResponse + ' Severity: ' + sevResponse + '\r\n IP address: ' + IPaddress + '\r\n Serial Number: ' + HWserialNum + '\r\n Contact Email address: ' + emailaddr;
                    sendMessage(token, roomId, adminMessage);                    
                    console.log('MS Teams Issue'); //Debug
                    break;
                
                case '3':
                    
                    // call send message for Zoom
                    mtype = 'Zoom';
                    adminMessage = 'Alert: Zoom Meeting reported with ' + avoResponse + ' Severity: ' + sevResponse + '\r\n IP address: ' + IPaddress + '\r\n Serial Number: ' + HWserialNum + '\r\n Contact Email address: ' + emailaddr;
                    sendMessage(token, roomId, adminMessage);                    
                    console.log('Zoom Issue'); //Debug
                    break;
            }
            
            xapi.Command.UserInterface.Message.Prompt.Display({ 
                Text: 'Do you want to open a ServiceNow ticket?',
                FeedbackId: 'roomfeedback_step5',
                'Option.1':'Yes',
                'Option.2':'No'
            });

            break;

        case 'roomfeedback_step5':

            const dscrptn = 'Issue with ' + mtype +' Meeting Number ' + mnum + '. Experiencing ' + avoResponse + '    IP address: ' + IPaddress + '    Serial Number: ' + HWserialNum + '    Software Version: ' + SoftwareVersion;
            const headers = [
                'Content-Type: application/json',
                'Authorization: Basic ' + SNOWuserNamePWDbase64,
            ];

            const body = {
                'description': dscrptn,
                'short_description': mtype + ' meeting issue reported. See Description for additional details',
                'priority': '1'
            };

            console.log("Stringify:" + JSON.stringify(body));  //Debug
            switch(event.OptionId){

                case '1':
                    console.log('Open ServiceNow ticket'); //Debug
                    
                    // Open SNOW ticket 
                    xapi.Command.HttpClient.Post({ Header: headers, 'Url': SNOWinstanceANDtable }, JSON.stringify(body)).then(
                        (result) => {
                        console.log('Response from SNOW: ' + JSON.stringify(result)); //Debug
                    });

                    xapi.Command.UserInterface.Message.TextLine.Display({   
                        Duration: 5, 
                        Text: 'Your input has been sent to the administrator and a ServiceNow ticket has been created.'
                    });
                    break;

                case '2':
                    xapi.Command.UserInterface.Message.TextLine.Display({   
                            Duration: 5, 
                            Text: 'Your input has been sent to the administrator.'
                    });
                    break;
            }


        break;        
    }
});

xapi.Event.UserInterface.Message.TextInput.Response.on((event) => {
    switch(event.FeedbackId){
        case 'roomfeedback_step3':
            emailaddr = event.Text;
            
            // Which meeting type?
            xapi.Command.UserInterface.Message.Prompt.Display({ 
                Text: 'Meeting type with the issue?',
                FeedbackId: 'roomfeedback_step4',
                'Option.1':'Webex',
                'Option.2':'Microsoft Teams',
                'Option.3':'Zoom'
             });
           
            break;
    }
});