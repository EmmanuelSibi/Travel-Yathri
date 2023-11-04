const { witresponse } = require("./apis/wit");

//async function named handleusermessage which takes user message and recipient phone as parameters
let destination_stored = "initial";
let source_stored;
let duration_stored;
let isdestination = true;

async function handleUserMessage(userMessage, recipientPhone) {
    try{
        const response = await witresponse(userMessage);//calling witresponse function
        console.log(response.data);
    if (response.data.intents && response.data.intents.length > 0) {
        const intentName = response.data.intents[0].name;

        if (intentName === "place") {
            if (destination_stored === "initial") {
              const locationBody =
                response.data.entities["wit$location:location"][0].body;
    
              destination_stored = locationBody;
    
              const sendmsg = `Thank you for choosing us\nYour selected destination is ${locationBody},\nTell us about your starting location of travel`;
              return sendmsg;
            } else {
              const locationBody =
                response.data.entities["wit$location:location"][0].body;
    
              source_stored = locationBody;
    
              const sendmsg = ` Your trip is planned to be from ${source_stored} to ${destination_stored}.\n Please mention how long will you be there ?`;
              return sendmsg;
            }
          } else if (intentName === "init_travel") {
            if (
              response.data.entities &&
              response.data.entities["wit$location:location"]
            ) {
              const locationBody =
                response.data.entities["wit$location:location"][0].body;
              source_stored = locationBody;
    
              const sendmsg = ` Your trip is planned to be from ${source_stored} to ${destination_stored}.\n Please mention how long will you be there ?`;
              return sendmsg;
            }
          }
          //////duration
          else if (intentName === "duration") {
            if (
              response.data.entities &&
              response.data.entities["wit$duration:duration"]
            ) {
              const locationBody =
                response.data.entities["wit$duration:duration"][0].body;
    
              duration_stored = locationBody;
              isDuration = true;}}

              else if (intentName === "greet") {
                isdestination = true;
        
                const sendmsg =
                  "Welcome to Testing\nTell us about your travel destination ";
        
                return sendmsg;
              }

}
 }catch(error){
     console.log("error in handle",error);

    }
}

module.exports = {handleUserMessage}; //exporting handleusermessage function    
