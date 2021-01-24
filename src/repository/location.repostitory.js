const { connection } = require("../config/mysql");
const { createPlaceholderString, toMysqlTimestampString } = require("../utils/mysql.utils");
const geohash = require('ngeohash');
const LocationDTO = require("../dtos/locationDTO.dto");
const { hasMissingKey } = require("../utils/compare.utils");

async function createLocation(
  locationDTO
) {
  if (hasMissingKey(locationDTO, new LocationDTO())) {
    throw new Error("invalid locationDTO");
  }
  const hash = geohash.encode(locationDTO.latitude, locationDTO.longitude)
  
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO FOODIE_LOCATION (
          ID,
          LOCATION_NAME,
          LOCATION_ADDRESS,
          LATITUDE,
          LONGITUDE,
          GEOHASH,
          CREATED_DATE,
          LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(8)})`,
      [
        null,
        locationDTO.locationName,
        locationDTO.locationAddress,
        locationDTO.latitude,
        locationDTO.longitude,
        hash,
        toMysqlTimestampString(new Date()),
        toMysqlTimestampString(new Date()),
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createLocation,
};
