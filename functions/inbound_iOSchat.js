const { db } = require("./init");

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");

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
          response.setBody({
            error: "An error occurred. Please try again later.",
          });
          callback(null, response);
        } else {
          response.setBody({ message: result.response });
          callback(null, response);
        }
      });
    } else {
      response.setBody({
        error: "Your account is not active. Please contact support.",
      });
      callback(null, response);
    }
  } catch (error) {
    console.error(
      "Error in iChatGPT_Firestore_user_status_verification:",
      error
    );
    response.setBody({ error: "An error occurred. Please try again later." });
    callback(null, response);
  }
};
