const { db } = require("./init");

exports.handler = async function (context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();
  const from = event.From;
  const userRef = db.collection("users").doc(from);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists && userDoc.data().status === "active") {
      // Call iChatGPT_OpenAI function with the message.
      const openaiHandler = require("./iChatGPT_OpenAI").handler;

      openaiHandler(context, { message: event.Body }, (error, result) => {
        if (error) {
          console.error("Error in iChatGPT_OpenAI:", error);
          twiml.message("An error occurred. Please try again later.");
          callback(null, twiml);
        } else {
          twiml.message(result.response);
          callback(null, twiml);
        }
      });
    } else {
      twiml.message("Your account is not active. Please contact support.");
      callback(null, twiml);
    }
  } catch (error) {
    console.error(
      "Error in iChatGPT_Firestore_user_status_verification:",
      error
    );
    twiml.message("An error occurred. Please try again later.");
    callback(null, twiml);
  }
};
