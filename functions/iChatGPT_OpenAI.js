const { openai_api } = require("./init");

const messages = [{ role: "system", content: "You are a helpful assistant." }];

const append_history = (content, role) => {
  messages.push({ role: role, content: content });
  return messages;
};

exports.handler = async function (context, event, callback) {
  append_history(event.message, "user");

  try {
    const response = await openai_api.createChatCompletion({
      engine: "gpt-3.5-turbo",
      prompt: {
        messages: messages,
      },
      max_tokens: 3000,
      n: 1,
      stop: null,
      temperature: 1,
    });
    console.log(response.choices[0].message.content);
    append_history(response, "assistant");
    callback(null, { response: response.choices[0].text });
  } catch (error) {
    console.error("Error in chat completion:", error);
    callback(error);
  }
};
