const express = require("express");
const bodyParser = require("body-parser");



const { Whatsapp } = require("./config");
const { handleUserMessage } = require("./bot/conversation");

let currentmsg = "h";

const app = express();

app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("kjehdberdbf");
});

let mytoken = "testing";

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});
console.log("hfff");
function isURL(variable) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  
  return urlPattern.test(variable);
}

app.post("/webhook", async (req, res) => {
  try {
    if( req && req.body){
        let data = Whatsapp.parseMessage(req.body);

        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of the customer
            let recipientName = incomingMessage.from.name; // extract the name of the customer
            let typeOfMsg = incomingMessage.type; // extract the type of message
            let message_id = incomingMessage.message_id; // extract the message id
            let userMessage = incomingMessage.text.body;
            if (currentmsg !== userMessage) {
              currentmsg = userMessage;
              console.log(userMessage);
               await handleUserMessage(userMessage, recipientPhone);
      
              /*await Whatsapp.sendText({
                message: `${response}`,
                recipientPhone: recipientPhone,
              });*/
            } else {
              console.log("reppp");
            }
          }}
          else  {

            const buttonText = req.messages[0].button.text;
            console.log(buttonText);


          }
    
    

   

    res.status(200).send("Message received and processed");
  } catch (error) {
    console.error("Error handling incoming message:", error);
    // Handle error and respond with an error status
    res.status(500).send("Internal Server Error");
  }
});
