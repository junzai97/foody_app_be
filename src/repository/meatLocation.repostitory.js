const { connection } = require("../config/mysql");
const LocationDTO = require("../dtos/locationDTO.dto");
const geohash = require("ngeohash");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");
const NearbyPrecision = require("../enums/nearbyPrecision.enum");
const { getDistanceFromLatLonInKm } = require("../utils/location.utils");

function createMeatLocation(meatId, locationId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT_LOCATION (
          ID,
          MEAT_ID,
          LOCATION_ID,
          CREATED_DATE,
          LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(5)})`,
      [
        null,
        meatId,
        locationId,
        toMysqlTimestampString(new Date()),
        toMysqlTimestampString(new Date()),
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function updateMeatLocationByMeatId(meatId, locationId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE MEAT_LOCATION SET 
      LOCATION_ID = ?
      WHERE MEAT_ID = ?
      `,
      [locationId, meatId],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

/**
 *
 * @returns Promise<LocationDTO>
 */
function findOneLocationByMeatId(meatId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT l.* FROM meat_location as ml
      left join foodie_location as l on ml.location_id = l.id
      where ml.meat_id = ?`,
      [meatId],
      (error, results, fields) => {
        const result = results[0];
        // console.log(result);
        error
          ? reject(error)
          : resolve(
              new LocationDTO(
                result.latitude,
                result.longitude,
                result.location_name,
                result.location_address
              )
            );
      }
    );
  });
}

function searchNearbyMeat(
  locationDTO,
  nearbyPrecision = NearbyPrecision.in20000m
) {
  const centerGeohash = geohash.encode(
    locationDTO.latitude,
    locationDTO.longitude
  );
  const startWithHash = centerGeohash.substring(0, nearbyPrecision);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT l.*, ml.meat_id FROM meat_location as ml
      left join foodie_location as l on ml.location_id = l.id
      where l.geohash like concat(?, '%')`,
      [startWithHash],
      (error, results, fields) => {
        error
          ? reject(error)
          : resolve(
              results.map((result) => {
                return {
                  meatId: result.meat_id,
                  distanceInKm: getDistanceFromLatLonInKm(
                    locationDTO.latitude,
                    locationDTO.longitude,
                    result.latitude,
                    result.longitude
                  ),
                };
              })
            );
      }
    );
  });
}

module.exports = {
  createMeatLocation,
  updateMeatLocationByMeatId,
  findOneLocationByMeatId,
  searchNearbyMeat,
};
