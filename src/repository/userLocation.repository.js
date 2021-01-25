const { connection } = require("../config/mysql");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");

function createUserLocation(userId, locationId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO USER_LOCATION (
          ID,
          USER_ID,
          LOCATION_ID,
          CREATED_DATE,
          LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(5)})`,
      [
        null,
        userId,
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

/**
 *
 * @returns Promise<LocationDTO>
 */
function findOneLocationByUserId(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT l.* FROM user_location as ul
      left join foodie_location as l on ul.location_id = l.id
      where ul.user_id = ?`,
      [userId],
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

module.exports = {
  createUserLocation,
  findOneLocationByUserId,
};
