const { Whatsapp } = require("../config");



const OpenAI = require("openai").OpenAI;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// Define a route to handle the POST request
async function plannerResponse(destination,source,duration,recipientPhone,isDuration) {
  try {

    if (isDuration) {
        const msg = `Thank you for choosing us.\n ⏳ Your detailed travel plan is being curated ⏳`;
        await Whatsapp.sendText({
          message: `${msg}`,
          recipientPhone: recipientPhone,
        });
        
        
        isDuration = false;
      }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are travel planner bot of travel yathri organisation",
        },
        {
          role: "user",
          content:
            `give a detailed travel plan for a trip starting from ${source} and to ${destination} for ${duration} `,
        },
      ],
    });

   


    return (response.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    plannerResponse
}
