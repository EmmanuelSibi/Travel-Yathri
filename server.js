// test


const bodyParser = require("body-parser");
const express = require("express");
const { Whatsapp } = require("./config");
const { handleUserMessage } = require("./conversation");
const app = express();
app.use(bodyParser.json());
  
const port = process.env.PORT || 3000;  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("kjehdberdbf");
});
const mytoken = "testing";

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

app.post("/webhook", async (req, res) => {
    try {
        let data = Whatsapp.parseMessage(req.body);
    
        if (data?.isMessage) {
          let incomingMessage = data.message;
          let recipientPhone = incomingMessage.from.phone; // extract the phone number of the customer
          let recipientName = incomingMessage.from.name; // extract the name of the customer
          let typeOfMsg = incomingMessage.type; // extract the type of message
          let message_id = incomingMessage.message_id; // extract the message id
          let userMessage = incomingMessage.text.body;
         
            
            console.log(userMessage);
            const response = await handleUserMessage(userMessage, recipientPhone);
            console.log(response);   
    
            await Whatsapp.sendText({
              message: `${response}`,
              recipientPhone: recipientPhone,
            });
          
        }
    
        res.status(200).send("Message received and processed");
      } catch (error) {
        console.error("Error handling incoming message:", error);
        
        res.status(500).send("Internal Server Error");
      }
  
    
  });
