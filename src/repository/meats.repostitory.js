const { connection } = require("../config/mysql");
const { createPlaceholderString, toMysqlTimestampString } = require("../utils/mysql.utils");
const { hasMissingKey } = require("../utils/compare.utils");
const Meat = require("../entities/meat.entity");
const MeatStatus = require("../enums/meatStatus.enum");

function createMeat(meat) {
  if (hasMissingKey(meat, new Meat(), ["id"])) {
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

function findOneMeat(meatId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM MEAT WHERE id = ?",
      [meatId],
      (error, results, fields) => {
        const result = results[0];
        error
          ? reject(error)
          : resolve(
              new Meat(
                result.id,
                result.image_storage_id,
                result.title,
                result.description,
                result.max_participant,
                result.start_time,
                result.end_time,
                result.status,
                result.created_date,
                result.last_modified_date
              )
            );
      }
    );
  });
}

function updateMeat(meatId, meat) {
  if (
    hasMissingKey(meat, new Meat(), ["id", "createdDate", "lastModifiedDate"])
  ) {
    throw new Error("Cannot update invalid Meat object to DB");
  }
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE MEAT SET 
      IMAGE_STORAGE_ID = ?,
      TITLE = ?,
      DESCRIPTION = ?,
      MAX_PARTICIPANT = ?,
      START_TIME = ?,
      END_TIME = ?,
      STATUS = ?,
      LAST_MODIFIED_DATE = ?
      WHERE ID = ?
      `,
      [
        meat.imageStorageId,
        meat.title,
        meat.description,
        meat.maxParticipant,
        meat.startTime,
        meat.endTime,
        meat.status,
        toMysqlTimestampString(new Date()),
        meatId,
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function cancelMeat(meatId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE MEAT SET 
      STATUS = ?,
      LAST_MODIFIED_DATE = ?
      WHERE ID = ?
      `,
      [
        MeatStatus.CANCELLED, 
        toMysqlTimestampString(new Date()),
        meatId,
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createMeat,
  findOneMeat,
  updateMeat,
  cancelMeat
};
