const { connection } = require("../config/mysql");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");
const Preference = require("../entities/Preference.entity");

function createMeatPreference(meatId, preferenceId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT_PREFERENCE (
        ID,
        MEAT_ID,
        PREFERENCE_ID,
        CREATED_DATE,
        LAST_MODIFIED_DATE
      ) VALUES (${createPlaceholderString(5)})`,
      [
        null,
        meatId,
        preferenceId,
        toMysqlTimestampString(new Date()),
        toMysqlTimestampString(new Date()),
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function findAllMeatPreferences(meatId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT P.* FROM MEAT_PREFERENCE AS MP
      LEFT JOIN PREFERENCE AS P ON MP.PREFERENCE_ID = P.ID
      where MP.MEAT_ID = ?
        `,
      [meatId],
      (error, results, fields) => {
        error
          ? reject(error)
          : resolve(
              results.map((result) => {
                return new Preference(
                  result.id,
                  result.name,
                  result.description,
                  result.created_date,
                  result.last_modified_date
                );
              })
            );
      }
    );
  });
}

function deleteMeatPreference(meatId, preferenceId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `delete from MEAT_PREFERENCE WHERE MEAT_ID = ? AND PREFERENCE_ID = ?`,
      [
        meatId,
        preferenceId,
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createMeatPreference,
  findAllMeatPreferences,
  deleteMeatPreference
};
