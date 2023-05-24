const twilio = require("twilio");
const { Configuration, OpenAIApi } = require("openai");
const MessagingResponse = twilio.twiml.MessagingResponse;

const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

async function iChatGPT_OpenAI(message) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const result = await openai.createCompletion({
      engine: "text-davinci-003",
      prompt: message,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    // Extract the best response from the result
    const response = result.choices[0].text.trim();

    return response;
  } catch (error) {
    console.error("Error in iChatGPT_OpenAI function:", error);
    return "An error occurred while processing your request. Please try again later.";
  }
}

async function updateFirestore(senderPhone, message, openaiResponse) {
  try {
    const conversationRef = db.collection("conversations").doc(senderPhone);
    const timestamp = admin.firestore.Timestamp.now();

    // Save the user's message
    await conversationRef.collection("messages").add({
      message,
      type: "user",
      timestamp,
    });

    // Save the OpenAI response
    await conversationRef.collection("messages").add({
      message: openaiResponse,
      type: "ai",
      timestamp,
    });
  } catch (error) {
    console.error("Error updating Firestore:", error);
  }
}

exports.handler = async function (context, event, callback) {
  const senderPhone = event.From;
  const message = event.Body;

  const openaiResponse = await iChatGPT_OpenAI(message);
  await updateFirestore(senderPhone, message, openaiResponse);

  const twiml = new MessagingResponse();
  twiml.message(openaiResponse);

  callback(null, twiml);
};
