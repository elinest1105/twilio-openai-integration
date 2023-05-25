const admin = require("firebase-admin");
const openai = require("openai");
const serviceAccount = require("..twilio-openai-d6a44-firebase-adminsdk-vde5o-1cefa4723e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

openai.apiKey = process.env.OPENAI_API_KEY;

const db = admin.firestore();
const openai_api = openai;

module.exports = { db, openai_api };
