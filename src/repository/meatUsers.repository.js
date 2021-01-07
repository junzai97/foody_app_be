const { connection } = require("../config/mysql");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");
const MeatUser = require("../entities/meatUser.entity");
const MeatUserStatus = require("../enums/meatUserStatus.enum");
const MeatUserRole = require("../enums/meatUserRole.enum");

function createMeatOrganiser(meatId, userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT_USER (
        ID,
        MEAT_ID,
        USER_ID,
        ROLE,
        STATUS,
        CREATED_DATE,
        LAST_MODIFIED_DATE
      ) VALUES (${createPlaceholderString(7)})`,
      [
        null,
        meatId,
        userId,
        MeatUserRole.ORGANISER,
        MeatUserStatus.GOING,
        toMysqlTimestampString(new Date()),
        toMysqlTimestampString(new Date()),
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function createMeatParticipant(meatId, userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO MEAT_USER (
        ID,
        MEAT_ID,
        USER_ID,
        ROLE,
        STATUS,
        CREATED_DATE,
        LAST_MODIFIED_DATE
      ) VALUES (${createPlaceholderString(7)})`,
      [
        null,
        meatId,
        userId,
        MeatUserRole.PARTICIPANT,
        MeatUserStatus.GOING,
        toMysqlTimestampString(new Date()),
        toMysqlTimestampString(new Date()),
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function updateMeatUserStatus(meatId, userId, status = MeatUserStatus.GOING) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE MEAT_USER SET 
        STATUS = ?,
        LAST_MODIFIED_DATE = ?
        WHERE MEAT_ID = ? 
        AND USER_ID = ?
        `,
      [status, toMysqlTimestampString(new Date()), meatId, userId],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

function findOneMeatUser(meatId, userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM MEAT_USER
        WHERE MEAT_ID = ?
        AND USER_ID = ?
        `,
      [meatId, userId],
      (error, results, fields) => {
        const result = results[0];
        error
          ? reject(error)
          : resolve(
              new MeatUser(
                result.id,
                result.meat_id,
                result.user_id,
                result.role,
                result.status,
                result.created_date,
                result.last_modified_date
              )
            );
      }
    );
  });
}

module.exports = {
  createMeatOrganiser,
};
