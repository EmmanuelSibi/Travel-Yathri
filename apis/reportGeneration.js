const { Whatsapp } = require("../config");

const OpenAI = require("openai").OpenAI;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define a route to handle the POST request
async function plannerResponse(
  destination,
  source,
  duration,
  recipientPhone,
  isDuration,
  flightdataselect,
  hoteldataselect,
  hoteldatachoice,
  flightdatachoice,
  starting_date
) {
  try {
    if(flightdatachoice && hoteldatachoice){
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are travel planner bot of travel yathri organisation",
              },
              {
                role: "user",
                content: `give a detailed travel plan for a trip starting from ${source} and to ${destination} for ${duration} where the user has selected ${flightdatachoice.airline} with flight number ${flightdatachoice.flightNumber} for the starting data ${starting_date} and ${hoteldatachoice.name} hotel `,
       
              },
            ],
          });
      
          return response.choices[0].message.content;
    }
    
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  plannerResponse,
};
