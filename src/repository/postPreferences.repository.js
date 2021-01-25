const {
    connection
} = require("../config/mysql");
const {
    createPlaceholderString,
    toMysqlTimestampString,
} = require("../utils/mysql.utils");
const Preference = require("../entities/Preference.entity");

function createPostPreference(postId, preferenceId) {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO POST_PREFERENCE (
            ID,
            POST_ID,
            PREFERENCE_ID,
            CREATED_DATE,
            LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(5)})`,
            [
                null,
                postId,
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

function findAllPostPreferences(postId) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT P.* FROM POST_PREFERENCE AS PP
            LEFT JOIN PREFERENCE AS P ON PP.PREFERENCE_ID = P.ID
            where PP.POST_ID = ?
            `,
            [postId],
            (error, results, fields) => {
                error
                    ?
                    reject(error) :
                    resolve(
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

function deletePostPreference(postId, preferenceId) {
    return new Promise((resolve, reject) => {
        connection.query(
            `delete from POST_PREFERENCE WHERE POST_ID = ? AND PREFERENCE_ID = ?`,
            [
                postId,
                preferenceId,
            ],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            }
        );
    });
}

module.exports = {
    createPostPreference,
    findAllPostPreferences,
    deletePostPreference
};