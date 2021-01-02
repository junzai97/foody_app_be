const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "foodie-vlog-27dc6.appspot.com"
})

const auth = app.auth();
const db = app.firestore();
const bucket = admin.storage().bucket();

module.exports = {
    auth,
    db,
    bucket
};


