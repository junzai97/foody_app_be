const { connection } = require("../config/mysql");
const Preference = require("../entities/Preference.entity");

function findAllPreferences() {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM preference order by name asc`,
      [],
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
  findAllPreferences,
};
