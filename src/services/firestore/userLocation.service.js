const FirestoreType = require("../../enums/firestoreType.enum");
const {
  _findDocuments,
} = require("./firestore.service");


async function findOneUserLocationByUserId(userId) {
  const queryDocumentSnapshots = await _findDocuments(
    FirestoreType.USER,
    "userId",
    "==",
    parseInt(userId)
  );
  if (queryDocumentSnapshots.length < 1) {
    throw new Error(`meat with id ${userId} is not found in firestore`);
  }
  const result = queryDocumentSnapshots[0];
  return {
    docId: result.id,
    data: result.data(),
  };
}

module.exports = {
    findOneUserLocationByUserId,
};
