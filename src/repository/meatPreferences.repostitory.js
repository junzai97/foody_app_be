const { connection } = require("../config/mysql");
const Preference = require("../entities/meatPreference.entity");

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
                new Preference(
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
  findAllMeatPreferences,
};
