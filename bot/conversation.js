const axios = require("axios");
const { plannerResponse } = require("../apis/reportGeneration");
const { Whatsapp } = require("../config");
const {
  uploadmediaToWhatsapp,
  sendMessageToWhatsapp,
  sendtemplate,
  sendtemplate_greet,
} = require("../utils/messageutils");
const { sendStringAsPdfToUser } = require("../utils/reportutil");
const { getFlightOffers } = require("../utils/flight");

let destination_stored = "initial";
let source_stored;
let duration_stored;
let starting_date;
let isdestination = true;
let flightchoice = false;
let flightdata={}
let flightselection=false;

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

      if (intentName === "duration") {
        if (
          response.data.entities &&
          response.data.entities["wit$duration:duration"]
        ) {
          const locationBody =
            response.data.entities["wit$duration:duration"][0].body;

          duration_stored = locationBody;
          isDuration = true;
          const sendmsg = "Your personalized trip plan is getting ready⌛️⌛️";
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });

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
        }
      }

      if (intentName === "place") {
        if (destination_stored === "initial") {
          const locationBody =
            response.data.entities["wit$location:location"][0].body;

          destination_stored = locationBody;

          const sendmsg = `Thank you for choosing us\nYour selected destination is ${locationBody},\nTell us about your starting location of travel`;
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });
          //return sendmsg;
        } else {
          const locationBody =
            response.data.entities["wit$location:location"][0].body;

          source_stored = locationBody;

          const sendmsg = ` Your trip is planned to be from ${source_stored} to ${destination_stored}.\n Please mention your starting date yyyy-mm-dd?`;
          //await sendtemplate(recipientPhone);
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });

          //return sendmsg;
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
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });
          //return sendmsg;
        }
      } else if (intentName === "date") {
        if (
          response.data.entities &&
          response.data.entities["wit$datetime:datetime"]
        ) {
          const locationBody =
            response.data.entities["wit$datetime:datetime"][0].body;

          starting_date = locationBody;

          await sendtemplate(recipientPhone);
        }
      } else if (intentName === "choice") {
        if (response.data.entities && response.data.entities["yes:yes"]) {
          flightchoice = true;
          console.log("flightchoice");
          if (flightchoice) {
            const transformedResponse = await getFlightOffers(
              source_stored,
              destination_stored,
              starting_date
            );
            flightdata=transformedResponse;
            
            const formattedText = Object.keys(transformedResponse).map((index) => {
              const flight = transformedResponse[index];
              return `Flight ${index + 1}:-\n Airline: ${flight.airline}- Flight Number: ${flight.flightNumber}\n- Price: ${flight.price}\n- Departure: ${flight.departure}\n- Arrival: ${flight.arrival}\n`;
          });

            await Whatsapp.sendText({
              message: `${formattedText}`,
              recipientPhone: recipientPhone,
            });
            const sendmsg = "Please select the flight number";
            await Whatsapp.sendText({
              message: `${sendmsg}`,
              recipientPhone: recipientPhone,
            });

            console.log("response");
           // console.log(response);
          }
          ////hotel choice
          else if(flightchoice){

          }

        } else {
          const sendmsg = "Okay How many days you want to stay there ?";
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });
        }
      }
      ////
      else if (intentName === "greet") {
        isdestination = true;

        const sendmsg =
          "Welcome to Travel Yatri\nTell us about your travel destination ";
        await Whatsapp.sendText({
          message: `${sendmsg}`,
          recipientPhone: recipientPhone,
        });
        //await sendtemplate_greet(recipientPhone);
        //return sendmsg;
      }

      //////
      else if (intentName === 'choice_num'){

        if(response.data.entities && response.data.entities["wit$number:number"] )
        {
          const flight_index = response.data.entities["wit$number:number"][0].body;
         const  flightdatachoice=flightdata[flight_index];
         console.log(flightdatachoice);
          const sendmsg = `Your selected flight is ${flightdatachoice.airline} ${flightdatachoice.flightNumber}  PRICE:${flightdatachoice.price} DEPT:${flightdatachoice.departure}  ARR:${flightdatachoice.arrival}\n`;


          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });
          flightselection=true;

          

         
          

          
         
        }

      }
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
          await Whatsapp.sendText({
            message: `${sendmsg}`,
            recipientPhone: recipientPhone,
          });
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
