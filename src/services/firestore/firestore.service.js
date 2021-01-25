const { db } = require("../../config/firebase");

async function _createDocument(collectionName, data) {
  const collectionRef = db.collection(collectionName).doc();
  return await collectionRef.set(JSON.parse(JSON.stringify(data)));
}

async function _findDocuments(collectionName, fieldPath, opStr, value) {
  const citiesRef = db.collection(collectionName);
  const querySnapshot = await citiesRef.where(fieldPath, opStr, value).get();
  return querySnapshot.docs;
}

async function _updateDocument(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(docId);
  return await docRef.update(JSON.parse(JSON.stringify(data)));
}

module.exports = {
  _createDocument,
  _updateDocument,
  _findDocuments,
};
