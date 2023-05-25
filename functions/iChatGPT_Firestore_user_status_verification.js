const { db } = require("./init");

exports.handler = async function (context, event, callback) {
  const from = event.From;
  const userRef = db.collection("users").doc(from);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists && userDoc.data().status === "active") {
      callback(null, { active: true });
    } else {
      callback(null, { active: false });
    }
  } catch (error) {
    callback(error);
  }
};
