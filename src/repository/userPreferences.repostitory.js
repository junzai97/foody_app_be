const { connection } = require("../config/mysql");
const Preference = require("../entities/meatPreference.entity");

function findAllUserPreferences(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT P.* FROM USER_PREFERENCE AS UP
      LEFT JOIN PREFERENCE AS P ON UP.PREFERENCE_ID = P.ID
      where UP.USER_ID = ?
        `,
      [userId],
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

module.exports = {
  findAllUserPreferences,
};
