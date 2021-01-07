const FirestoreType = require("../enums/firestoreType.enum");
const geofire = require("geofire-common");
const { db } = require("../config/firebase");
const { hasMissingKey } = require("../utils/compare.utils");
const LocationDTO = require("../dtos/locationDTO.dto");
const MeatLocation = require("../entities/firestore/meatLocation.entity");

async function createMeatLocation(meatId, locationDTO) {
  if (hasMissingKey(locationDTO, new LocationDTO())) {
    throw new Error("invalid locationDTO");
  }
  const geoHash = geofire.geohashForLocation([
    locationDTO.latitude,
    locationDTO.longitude,
  ]);
  const meatLocation = new MeatLocation(
    meatId,
    locationDTO.latitude,
    locationDTO.longitude,
    geoHash
  );
  return await _createDocument(FirestoreType.MEAT, meatLocation);
}

async function updateMeatLocation(meatId, locationDTO) {
  if (hasMissingKey(locationDTO, new LocationDTO())) {
    throw new Error("invalid locationDTO");
  }
  const geoHash = geofire.geohashForLocation([
    locationDTO.latitude,
    locationDTO.longitude,
  ]);
  const meatLocation = new MeatLocation(
    meatId,
    locationDTO.latitude,
    locationDTO.longitude,
    geoHash
  );
  const { docId } = await findOneMeatLocationByMeatId(meatId);
  return await _updateDocument(FirestoreType.MEAT, docId, meatLocation);
}

async function findOneMeatLocationByMeatId(meatId) {
  const queryDocumentSnapshots = await _findDocuments(
    FirestoreType.MEAT,
    "meatId",
    "==",
    parseInt(meatId)
  );
  if (queryDocumentSnapshots.length < 1) {
    throw new Error(`meat with id ${meatId} is not found in firestore`);
  }
  const result = queryDocumentSnapshots[0];
  return {
    docId: result.id,
    data: result.data()
  };
}

/**
 *
 * @description this is a private function. Don't include it in module.exports
 */
async function _createDocument(collectionName, data) {
  const collectionRef = db.collection(collectionName).doc();
  return await collectionRef.set(JSON.parse(JSON.stringify(data)));
}

/**
 *
 * @description this is a private function. Don't include it in module.exports
 */
async function _findDocuments(collectionName, fieldPath, opStr, value) {
  const citiesRef = db.collection(collectionName);
  const querySnapshot = await citiesRef.where(fieldPath, opStr, value).get();
  return querySnapshot.docs;
}

/**
 *
 * @description this is a private function. Don't include it in module.exports
 */
async function _updateDocument(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(docId);
  return await docRef.update(JSON.parse(JSON.stringify(data)));
}

module.exports = {
  createMeatLocation,
  updateMeatLocation,
  findOneMeatLocationByMeatId
};
