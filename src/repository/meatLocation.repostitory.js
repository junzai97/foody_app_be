const { connection } = require("../config/mysql");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");

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
      left join foodie_location as l on ml.id = l.id
      where ml.meat_id = ?`,
      [meatId],
      (error, results, fields) => {
        const result = results[0];
        console.log(result);
        error
          ? reject(error)
          : resolve(
              new LocationDTO(
                result.location_name,
                result.location_address,
                result.latitude,
                result.longitude
              )
            );
      }
    );
  });
}

module.exports = {
  createMeatLocation,
  updateMeatLocationByMeatId,
  findOneLocationByMeatId
};
