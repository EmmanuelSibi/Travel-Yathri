
const axios = require("axios");
 async function witresponse(userMessage) {
    const witAccessToken =process.env.WIT_ACCESS_TOKEN ;
    const apiUrl = `https://api.wit.ai/message?v=20230904&q=${encodeURIComponent(
      userMessage
    )}`;
    const headers = {
      Authorization: `Bearer ${witAccessToken}`,
    };
  
    try {
      const response = await axios.get(apiUrl, { headers });
      return response;
}catch(error){
    console.log(error);
}
 }

module.exports = {witresponse}; 