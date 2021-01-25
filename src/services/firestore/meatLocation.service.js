const FirestoreType = require("../../enums/firestoreType.enum");
const geofire = require("geofire-common");
const { hasMissingKey } = require("../../utils/compare.utils");
const LocationDTO = require("../../dtos/locationDTO.dto");
const MeatLocation = require("../../entities/firestore/meatLocation.entity");
const {
  _createDocument,
  _updateDocument,
  _findDocuments,
} = require("./firestore.service");

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
    data: result.data(),
  };
}

module.exports = {
  createMeatLocation,
  updateMeatLocation,
  findOneMeatLocationByMeatId,
};
