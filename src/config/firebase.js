const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const auth = app.auth();
const db = app.firestore();

module.exports = {
    auth,
    db
};


