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

/**
 * 
 * @description this is a private function. Don't include it in module.exports
 */
async function _createDocument(collectionName, data) {
  const collectionRef = db.collection(collectionName).doc();
  return await collectionRef.set(data);
}

module.exports = {
  createMeatLocation,
};
