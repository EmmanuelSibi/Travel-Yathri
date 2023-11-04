const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
//upload media
async function uploadmediaToWhatsapp(pdffilepath) {
  try {
    const data = new FormData();
    data.append("messaging_product", "whatsapp");
    data.append("file", fs.createReadStream(pdffilepath));

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v17.0/${process.env.SENDER_ID}/media`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data.id;
  } catch (error) {
    throw error;
  }
}

//send doc

async function sendMessageToWhatsapp(id, recipientPhone) {
  try {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${recipientPhone}`,
      type: "document",
      document: {
        id: id,
        caption: "Your Personalised Trip Plan",
        filename: "Trip Plan.pdf",
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v17.0/${process.env.SENDER_ID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
      },
      data: data,
    };

    const response = await axios.request(config);
    console.log("successfully send the media");
  } catch (error) {
    console.log(error);
  }
}

async function sendtemplate(recipientPhone) {
  try {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      to: `${recipientPhone}`,
      recipient_type: "individual",
      type: "template",
      template: {
        name: "flight_options",
        language: {
          code: "en_us",
        },
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v17.0/${process.env.SENDER_ID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
      },
      data: data,
    };
    const response = await axios.request(config);
    console.log("successfully send the media");
  } catch (error) {
    console.log(error);
  }
}

async function sendtemplate_greet(recipientPhone) {
  try {
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      to: `${recipientPhone}`,
      recipient_type: "individual",
      type: "template",
      template: {
        name: "greet",
        language: {
          code: "en_uk",
        }
       
      },
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v17.0/${process.env.SENDER_ID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
      },
      data: data,
    };
    const response = await axios.request(config);
    console.log("successfully send the media");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadmediaToWhatsapp, sendMessageToWhatsapp, sendtemplate,sendtemplate_greet };
