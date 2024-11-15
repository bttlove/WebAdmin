// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chamcong-a0f9d-default-rtdb.firebaseio.com"
});

module.exports = admin;
