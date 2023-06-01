const admin = require("firebase-admin");
const fs = require("fs");

// Define the Twilio Function
exports.handler = async function (context, event, callback) {
  // Access the path to the 'firebase-private-key.json' Asset
  const privateKeyPath = Runtime.getAssets()["/firebase-chatgpt-key.json"].path;

  // Read the content of the 'firebase-private-key.json' Asset using the 'fs' module
  const privateKeyDataRaw = fs.readFileSync(privateKeyPath, "utf8");

  // Parse the JSON content of the Asset
  const privateKeyData = JSON.parse(privateKeyDataRaw);

  // Replace escaped newline characters in the private key with actual newline characters
  privateKeyData.private_key = privateKeyData.private_key.replace(/\\n/g, "\n");

  // Initialize the Firebase Admin SDK if it hasn't been initialized already
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(privateKeyData),
    });
  }

  // Get a reference to the Firestore database
  const db = admin.firestore();
  // Create an object with the data to be stored   in Firestore
  const data = {
    Body: String(event.Body),
    Email: String(event.Email),
    From: String(event.From),
  };

  console.log("data----------->", data);

  // Try to add the data to the Firestore 'user' collection
  try {
    await db.collection("user").add(data);

    // If successful, create a response object and send it to the client
    const response = {
      body: "Document created",
    };
    callback(null, response);
  } catch (error) {
    // If an error occurs, log it and send an error response to the client
    console.error("Error adding document:", error);
    const response = {
      body: "Failed to create document",
    };
    callback(error, response);
  }
};
