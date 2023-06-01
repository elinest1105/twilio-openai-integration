exports.handler = async function (context, event, callback) {
  console.log("event.body", event.Body);
  const twiml = new Twilio.twiml.MessagingResponse();

  try {
    // Call iChatGPT_OpenAI function with the message.
    const openaiPath = Runtime.getFunctions()["iChatGPT_OpenAI"].path;
    const openaiHandler = require(openaiPath).handler;

    openaiHandler(context, event, (error, result) => {
      if (error) {
        console.error("Error in iChatGPT_OpenAI:", error);
        twiml.message("An error occurred. Please try again later.");
        callback(null, twiml);
      } else {
        twiml.message(result.response);
        callback(null, twiml);
      }
    });
  } catch (error) {
    console.error(
      "Error in iChatGPT_Firestore_user_status_verification:",
      error
    );
    twiml.message("An error occurred. Please try again later.");
    callback(null, twiml);
  }
};
