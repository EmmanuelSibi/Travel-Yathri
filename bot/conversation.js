const axios = require("axios");
const { plannerResponse } = require("../apis/reportGeneration");
const { Whatsapp } = require("../config");
const {
  uploadmediaToWhatsapp,
  sendMessageToWhatsapp,
} = require("../utils/messageutils");
const { sendStringAsPdfToUser } = require("../utils/reportutil");


let destination_stored = "initial";
let source_stored;
let duration_stored;
let isdestination = true;

async function handleUserMessage(message, recipientPhone) {
  const witAccessToken = "IHXJHUJOVOHNA6QFICIXSQZCA53NRYNG";
  const apiUrl = `https://api.wit.ai/message?v=20230904&q=${encodeURIComponent(
    message
  )}`;
  const headers = {
    Authorization: `Bearer ${witAccessToken}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });

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
     
      else if (intentName === "duration") {
        if (
          response.data.entities &&
          response.data.entities["wit$duration:duration"]
        ) {
          const locationBody =
            response.data.entities["wit$duration:duration"][0].body;

          duration_stored = locationBody;
          isDuration = true;

          const response_report = await plannerResponse(
            destination_stored,
            source_stored,
            duration_stored,
            recipientPhone,
            isDuration
          );
          const pdfUrl = await sendStringAsPdfToUser(response_report);

         
          
          console.log(pdfUrl);
          const media_id = await uploadmediaToWhatsapp(pdfUrl);
          console.log(media_id);
          await sendMessageToWhatsapp(media_id, recipientPhone);
          return "testing";
        }
      }
      ////
      else if (intentName === "greet") {
        isdestination = true;

        const sendmsg =
          "Welcome to Travel Yatri\nTell us about your travel destination ";

        return sendmsg;
      }

      //////
      else if (intentName === "des_travel" || isdestination) {
        if (
          response.data.entities &&
          response.data.entities["wit$location:location"]
        ) {
          const locationBody =
            response.data.entities["wit$location:location"][0].body;

          destination_stored = locationBody;

          const sendmsg = `Thank you for choosing us\nYour selected destination is ${locationBody},\nTell us about your starting location of travel`;
          isdestination = false;
          return sendmsg;
        }
      }

      console.log("Wit.ai response:", response.data);
    } else {
      console.error("No intents found in the Wit.ai response");
    }
  } catch (error) {
    console.error("Error making the request:", error);
  }
}

module.exports = {
  handleUserMessage,
};
