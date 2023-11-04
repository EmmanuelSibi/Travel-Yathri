require('dotenv').config();
//configuring whatsapp cloud api and whatsapp cloud api wrapper
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');


const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.WHATSAPP_API_ACCESS_TOKEN,
    senderPhoneNumberId: process.env.SENDER_ID ,
    WABA_ID: process.env.WABA_ID,
});

module.exports = {Whatsapp};