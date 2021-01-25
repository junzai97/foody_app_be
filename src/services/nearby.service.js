const FirestoreType = require("../enums/firestoreType.enum");
const geofire = require("geofire-common");
const { db } = require("../config/firebase");
const { hasMissingKey } = require("../utils/compare.utils");
const LocationDTO = require("../dtos/locationDTO.dto");
const MeatLocation = require("../entities/firestore/meatLocation.entity");

async function searchNearbyMeat(myLocation, radiusInKm) {
  const results = await _searchNearby(
    FirestoreType.MEAT,
    myLocation,
    radiusInKm
  );
  return results.map(({ doc, distanceInKm }) => {
    const docData = doc.data();
    const meatLocation = new MeatLocation(
      docData.meatId,
      docData.latitude,
      docData.longitude,
      docData.geohash
    );
    return {
      distanceInKm: distanceInKm,
      meatId: meatLocation.meatId,
    };
  });
}

/**
 *
 * @description this is a private function. Don't include it in module.exports
 * @tutorial https://firebase.google.com/docs/firestore/solutions/geoqueries
 */
async function _searchNearby(firestoreType, myLocation, radiusInKm = 10) {
  if (hasMissingKey(myLocation, new LocationDTO())) {
    throw new Error("invalid locationDTO input to search nearby");
  }
  const center = [myLocation.latitude, myLocation.longitude];
  const radiusInM = radiusInKm * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = db
      .collection(firestoreType)
      .orderBy("geohash")
      .startAt(b[0])
      .endAt(b[1]);

    promises.push(q.get());
  }

  // Collect all the query results together into a single list
  const snapshots = await Promise.all(promises);
  const matchingDocs = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get("latitude");
      const lng = doc.get("longitude");

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween([lat, lng], center);
      const distanceInM = distanceInKm * 1000;
      if (distanceInM <= radiusInM) {
        matchingDocs.push({ doc, distanceInKm });
      }
    }
  }

  return matchingDocs;
}

module.exports = {
  searchNearbyMeat,
};
