const { toMysqlTimestampString } = require("../utils/mysql.utils");
const {
  createMeat,
  updateMeat,
  cancelMeat,
  findAllMeatsInMeatIdsAndStatusIsAndEndTimeAfter,
  findOneMeat,
} = require("../repository/meats.repository");
const {
  createStorage,
  findOneStorage,
} = require("../repository/storage.repository");
const Meat = require("../entities/meat.entity");
const MeatStatus = require("../enums/meatStatus.enum");
const AttachmentType = require("../enums/attachmentType.enum");
const BadRequestException = require("../exceptions/badRequestException.exception");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  getMeatAnalyticsService,
  createMeatOrganiserService,
  findGoingMeatsService,
} = require("./meatUser.service");
const {
  createMeatPreferencesService,
  updateMeatPreferencesService,
} = require("./meatPreference.service");

const {
  findAllMeatPreferences,
} = require("../repository/meatPreferences.repository");
const {
  findAllUserPreferences,
} = require("../repository/userPreferences.repository");
const {
  findOneLocationByUserId
} = require("../repository/userLocation.repository")
const {
  findOneUserLocationByUserId,
} = require("../services/firestore/userLocation.service");
const { searchNearbyMeat } = require("../repository/meatLocation.repository");
const isBefore = require("date-fns/isBefore");
const {
  createMeatLocation,
  updateMeatLocationByMeatId,
  findOneLocationByMeatId,
} = require("../repository/meatLocation.repository");
const MeatUserStatus = require("../enums/meatUserStatus.enum");

async function createMeatService(meatDTO, userId) {
  const savedStorageResult = await createStorage(
    meatDTO.base64String,
    AttachmentType.MEAT
  );
  const meat = new Meat(
    null,
    savedStorageResult.insertId,
    meatDTO.title,
    meatDTO.description,
    meatDTO.maxParticipant,
    toMysqlTimestampString(new Date(meatDTO.startTime)),
    toMysqlTimestampString(new Date(meatDTO.endTime)),
    MeatStatus.ONGOING,
    toMysqlTimestampString(new Date()),
    toMysqlTimestampString(new Date())
  );
  const meatMysqlResponse = await createMeat(meat);
  const meatId = meatMysqlResponse.insertId;
  const meatPreferenceMysqlResponse = await createMeatPreferencesService(
    meatId,
    meatDTO.preferenceIds
  );
  const locationMysqlRes = await createLocation(meatDTO.locationDTO);
  const locationId = locationMysqlRes.insertId;
  const meatLocationMysqlRes = await createMeatLocation(meatId, locationId);
  const meatLocationId = meatLocationMysqlRes.insertId;
  const meatUserMysqlResponse = await createMeatOrganiserService(
    meatId,
    userId
  );
  return meatMysqlResponse;
}

async function updateMeatService(meatDTO) {
  const originalMeat = await findOneMeat(meatDTO.id);
  let newMeat = new Meat(
    originalMeat.id,
    originalMeat.imageStorageId,
    meatDTO.title,
    meatDTO.description,
    meatDTO.maxParticipant,
    toMysqlTimestampString(new Date(meatDTO.startTime)),
    toMysqlTimestampString(new Date(meatDTO.endTime)),
    originalMeat.status,
    originalMeat.createdDate,
    toMysqlTimestampString(new Date())
  );
  if (meatDTO.base64String) {
    // only update storage if meatDTO has base64String
    const savedStorageResult = await createStorage(
      meatDTO.base64String,
      AttachmentType.MEAT
    );
    newMeat.imageStorageId = savedStorageResult.insertId;
  }
  const mysqlResponse = await updateMeat(originalMeat.id, newMeat);
  if (mysqlResponse.affectedRows < 1) {
    throw new BadRequestException("no meat is updated. Is meat exist?");
  }
  await updateMeatPreferencesService(originalMeat.id, meatDTO.preferenceIds);
  if (meatDTO.locationDTO) {
    // only update locationDTO if exist
    const locationMysqlRes = await createLocation(meatDTO.locationDTO);
    const locationId = locationMysqlRes.insertId;
    const meatLocationMysqlRes = await updateMeatLocationByMeatId(meatDTO.id, locationId);
    if (meatLocationMysqlRes.affectedRows < 1) {
      throw new BadRequestException(
        "no meatLocation is updated. Is meatLocation exist?"
      );
    }
  }
  return mysqlResponse;
}

async function cancelMeatService(meatId) {
  const mysqlResponse = await cancelMeat(meatId);
  if (mysqlResponse.affectedRows < 1) {
    throw new BadRequestException("no meat is cancelled. Is meat exist?");
  }
  return mysqlResponse;
}

async function findExploreMeats(userId, preferenceIds, locationDTO) {
  if (preferenceIds.length === 0) {
    const preferences = await findAllUserPreferences(userId);
    preferenceIds = preferences.map((preference) => preference.id);
  }
  if (!locationDTO) {
    locationDTO = await findOneLocationByUserId(userId);
  }
  const meats = await searchNearbyMeat(locationDTO);
  // console.log(meats.map(el => el.meatId));
  console.log(meats.length," nearby meats");
  const matchedResult = [];
  for (let index = 0; index < meats.length; index++) {
    const { distanceInKm, meatId } = meats[index];
    const preferences = await findAllMeatPreferences(meatId);
    const isPreferenceMatch = preferences
      .map((preference) => preference.id)
      .some((value) => preferenceIds.includes(value));
      // console.log(preferenceIds);
    if (!isPreferenceMatch) {
      console.log(meatId, " oops, preference not matched")
      continue;
    }
    const meat = await findOneMeat(meatId);
    const isOngoing = meat.status === MeatStatus.ONGOING;
    if (!isOngoing) {
      console.log(meatId, " oops, it's not ongoing")
      continue;
    }
    const isEnded = isBefore(new Date(meat.endTime), new Date());
    if (isEnded) {
      console.log(meatId, " oops, it's ended")
      continue;
    }
    const { totalParticipants, status } = await getMeatAnalyticsService(meatId);
    const hasVacant = totalParticipants < meat.maxParticipant;
    if (!hasVacant) {
      console.log(meatId, " oops, it's reach max participant")
      continue;
    }
    const hasJoined = status !== null
    if (hasJoined) {
      console.log(meatId, " oops, you ady joined")
      continue;
    }
    const storage = await findOneStorage(meat.imageStorageId);
    matchedResult.push({
      id: meat.id,
      imageUrl: storage.mediaLink,
      title: meat.title,
      description: meat.description,
      maxParticipant: meat.maxParticipant,
      startTime: meat.startTime,
      endTime: meat.endTime,
      status: meat.status,
      createdDate: meat.createdDate,
      lastModifiedDate: meat.lastModifiedDate,
      distanceInKm,
    });
  }
  return matchedResult;
}

async function findUpcomingMeats(userId) {
  const goingMeatIds = await findGoingMeatsService(userId);
  const meats = await findAllMeatsInMeatIdsAndStatusIsAndEndTimeAfter(
    goingMeatIds,
    MeatStatus.ONGOING
  );
  console.log(meats);
  return Promise.all(
    meats.map(async (meat) => {
      const storage = await findOneStorage(meat.imageStorageId);
      return {
        id: meat.id,
        imageUrl: storage.mediaLink,
        title: meat.title,
        description: meat.description,
        maxParticipant: meat.maxParticipant,
        startTime: meat.startTime,
        endTime: meat.endTime,
        status: meat.status,
        createdDate: meat.createdDate,
        lastModifiedDate: meat.lastModifiedDate,
      };
    })
  );
}

async function findOneMeatService(meatId, userId) {
  const meat = await findOneMeat(meatId);
  const storage = await findOneStorage(meat.imageStorageId);
  const locationDTO = await findOneLocationByMeatId(meatId);
  const { totalParticipants, role, status } = await getMeatAnalyticsService(
    meatId,
    userId
  );
  const preferences = await findAllMeatPreferences(meatId);
  const result = {
    id: meat.id,
    imageUrl: storage.mediaLink,
    title: meat.title,
    description: meat.description,
    maxParticipant: meat.maxParticipant,
    startTime: meat.startTime,
    endTime: meat.endTime,
    meatStatus: meat.status,
    locationDTO: locationDTO,
    totalParticipants: totalParticipants,
    role: role,
    userStatus: status,
    preferences: preferences,
    createdDate: meat.createdDate,
    lastModifiedDate: meat.lastModifiedDate,
  };
  return result;
}

module.exports = {
  createMeatService,
  updateMeatService,
  cancelMeatService,
  findExploreMeats,
  findUpcomingMeats,
  findOneMeatService,
};
