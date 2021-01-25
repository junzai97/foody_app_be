const { connection } = require("../config/mysql");
const LocationDTO = require("../dtos/locationDTO.dto");
const geohash = require("ngeohash");
const {
    createPlaceholderString,
    toMysqlTimestampString,
} = require("../utils/mysql.utils");
const NearbyPrecision = require("../enums/nearbyPrecision.enum");
const { getDistanceFromLatLonInKm } = require("../utils/location.utils");


function createPostLocation(postId, locationId) {
    return new Promise((resolve, reject) => {
        connection.query(
        `INSERT INTO POST_LOCATION (
          ID,
          POST_ID,
          LOCATION_ID,
          CREATED_DATE,
          LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(5)})`,
            [
                null,
                postId,
                locationId,
                toMysqlTimestampString(new Date()),
                toMysqlTimestampString(new Date()),
            ],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            }
        );
    });
}

/**
 *
 * @returns Promise<LocationDTO>
 */
function findOneLocationByPostId(postId) {
    return new Promise((resolve, reject) => {
        connection.query(
        `SELECT location.* FROM POST_LOCATION as pl
            left join foodie_location as location on pl.id = location.id
            where pl.post_id = ?`,
            [postId],
            (error, results, fields) => {
                const result = results[0];
                console.log(result);
                error
                    ? reject(error)
                    : resolve(
                        new LocationDTO(
                            result.latitude,
                            result.longitude,
                            result.location_name,
                            result.location_address
                        )
                    );
            }
        );
    });
}

// Search Nearby Post
function searchNearbyPost(
    locationDTO,
    nearbyPrecision = NearbyPrecision.in20000m
  ) {
    const centerGeohash = geohash.encode(
        locationDTO.latitude,
        locationDTO.longitude
    );
    const startWithHash = centerGeohash.substring(0, nearbyPrecision);
    return new Promise((resolve, reject) => {
        connection.query(
        `SELECT l.*, ml.meat_id FROM post_location as pl
        left join foodie_location as l on pl.location_id = l.id
        where l.geohash like concat(?, '%')`,
        [startWithHash],
        (error, results, fields) => {
            error
                ? reject(error)
                : resolve(
                    results.map((result) => {
                        return {
                        postId: result.post_id,
                        distanceInKm: getDistanceFromLatLonInKm(
                            locationDTO.latitude,
                            locationDTO.longitude,
                            result.latitude,
                            result.longitude
                        ),
                        };
                    })
                );
            }
        );
    });
}
  
module.exports = {
    createPostLocation,
    findOneLocationByPostId,
    searchNearbyPost
};
