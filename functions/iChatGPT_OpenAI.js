// 2023-05-22 - Alex: This function is used to forward messages from various inbound channels (Facebook Messenger, Twiter DM, WhatsApp, SMS, in-App iOS Chat) to the OpenAI API and to capture the response from the OpenAI API.

// Use the OpenAI_SID environment variable key when calling the createChatCompletion method on the OpenAIApi object to generate a chat response.

// Do not use the older OpenAI engine such as openai.createCompletion with model: "text-davinci-003". Please use openai.createChatCompletion with model: "gpt-3.5-turbo".

// The OpenAI training message is passed as text in the messages array with a "role" of "system" and "content" of "text string".

// The sender message is passed as an object in the messages array with a "role" of "user" and "content" of "text string".

// import { openai_api } from "./init";
// 2023-05-22 - Alex: This function is used to forward messages from various inbound channels (Facebook Messenger, Twiter DM, WhatsApp, SMS, in-App iOS Chat) to the OpenAI API and to capture the response from the OpenAI API.

// Use the OpenAI_SID environment variable key when calling the createChatCompletion method on the OpenAIApi object to generate a chat response.

// Do not use the older OpenAI engine such as openai.createCompletion with model: "text-davinci-003". Please use openai.createChatCompletion with model: "gpt-3.5-turbo".

// The OpenAI training message is passed as text in the messages array with a "role" of "system" and "content" of "text string".

// The sender message is passed as an object in the messages array with a "role" of "user" and "content" of "text string".
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (context, event, callback) {
  console.log("event received!", event.Body);
  const configuration = new Configuration({
    apiKey: context.OpenAI_SID,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You provide short and concise answers.",
        role: "user",
        content: event.Body,
      },
    ],
  });

  const responseMessage = completion.data.choices[0].message.content.trim();
  callback(null, { response: responseMessage });
};
