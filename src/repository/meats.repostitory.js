const { connection } = require("../config/mysql");
const {createPlaceholderString} = require('../utils/mysql.utils')

function createMeat(meat) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT (
        ID,
        IMAGE_STORAGE_ID,
        TITLE,
        DESCRIPTION,
        MAX_PARTICIPANT,
        STARTTIME,
        ENDTIME,
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
