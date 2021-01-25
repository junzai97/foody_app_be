const { connection } = require("../config/mysql");
const { createPlaceholderString } = require("../utils/mysql.utils");
const { hasMissingKey } = require("../utils/compare.utils");
const Meat = require("../entities/meat.entity");

function createMeat(meat) {
  if (hasMissingKey(meat, new Meat())) {
    throw new Error("Cannot save invalid Meat object to DB");
  }
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT (
        ID,
        IMAGE_STORAGE_ID,
        TITLE,
        DESCRIPTION,
        MAX_PARTICIPANT,
        START_TIME,
        END_TIME,
        STATUS,
        CREATED_DATE,
        LAST_MODIFIED_DATE
      ) VALUES (${createPlaceholderString(10)})`,
      [
        meat.id,
        meat.imageStorageId,
        meat.title,
        meat.description,
        meat.maxParticipant,
        meat.startTime,
        meat.endTime,
        meat.status,
        meat.createdDate,
        meat.lastModifiedDate,
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createMeat,
};
