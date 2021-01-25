const { connection } = require("../config/mysql");
const {
  createPlaceholderString,
  toMysqlTimestampString,
} = require("../utils/mysql.utils");
const MeatUser = require("../entities/meatUser.entity");
const MeatUserStatus = require("../enums/meatUserStatus.enum");
const MeatUserRole = require("../enums/meatUserRole.enum");

function createMeatUser(
  meatId,
  userId,
  meatUserRole = MeatUserRole.PARTICIPANT
) {
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
        meatUserRole,
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

function findAllMeatUserByMeatId(meatId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM MEAT_USER
        WHERE MEAT_ID = ?
        `,
      [meatId],
      (error, results, fields) => {
        error
          ? reject(error)
          : resolve(
              results.map((result) => {
                return new MeatUser(
                  result.id,
                  result.meat_id,
                  result.user_id,
                  result.role,
                  result.status,
                  result.created_date,
                  result.last_modified_date
                );
              })
            );
      }
    );
  });
}

function findAllMeatUserByUserIdAndStatus(
  userId,
  status = MeatUserStatus.GOING
) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM MEAT_USER
        WHERE USER_ID = ?
        AND STATUS = ?
        `,
      [userId, status],
      (error, results, fields) => {
        error
          ? reject(error)
          : resolve(
              results.map((result) => {
                return new MeatUser(
                  result.id,
                  result.meat_id,
                  result.user_id,
                  result.role,
                  result.status,
                  result.created_date,
                  result.last_modified_date
                );
              })
            );
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

function findAllMeatUsersByMeatIdAndMeatUserStatus(
  meatId,
  meatUserStatus = MeatUserStatus.GOING
) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT mu.*, u.username, s.media_link FROM MEAT_USER as mu 
      left join user as u on mu.user_id = u.id
      left join storage as s on u.image_storage_id = s.id
              WHERE MEAT_ID = ? AND mu.status = ?`,
      [meatId, meatUserStatus],
      (error, results, fields) => {
        error
          ? reject(error)
          : resolve(
              results.map((result) => {
                return {
                  userId: result.user_id,
                  role: result.role,
                  status: result.status,
                  username: result.username,
                  imageUrl: result.media_link,
                };
              })
            );
      }
    );
  });
  return;
}

module.exports = {
  createMeatUser,
  updateMeatUserStatus,
  findAllMeatUserByMeatId,
  findAllMeatUserByUserIdAndStatus,
  findOneMeatUser,
  findAllMeatUsersByMeatIdAndMeatUserStatus,
};
