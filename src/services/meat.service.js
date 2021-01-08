const { toMysqlTimestampString } = require("../utils/mysql.utils");
const {
  createMeatLocation,
  updateMeatLocation,
  findOneMeatLocationByMeatId,
} = require("../services/firestore.service");
const {
  createMeat,
  findOneMeat,
  updateMeat,
  cancelMeat,
} = require("../repository/meats.repostitory");
const {
  createStorage,
  findOneStorage,
} = require("../repository/storage.repostitory");
const Meat = require("../entities/meat.entity");
const MeatStatus = require("../enums/meatStatus.enum");
const AttachmentType = require("../enums/attachmentType.enum");
const BadRequestException = require("../exceptions/badRequestException.exception");
const LocationDTO = require("../dtos/locationDTO.dto");
const {
  getMeatAnalyticsService,
  createMeatOrganiserService,
} = require("./meatUser.service");
const {
  getAllMeatPreferenceService,
  createMeatPreferencesService,
} = require("./meatPreference.service");

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
  const firestoreData = await createMeatLocation(meatId, meatDTO.locationDTO);
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
  if (meatDTO.locationDTO) {
    // only update locationDTO if exist
    const updatedFirestoreData = await updateMeatLocation(
      meatDTO.id,
      meatDTO.locationDTO
    );
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

async function findOneMeatService(meatId) {
  const meat = await findOneMeat(meatId);
  const storage = await findOneStorage(meat.imageStorageId);
  const { data } = await findOneMeatLocationByMeatId(meatId);
  const { totalParticipants, role } = await getMeatAnalyticsService(meatId);
  const preferences = await getAllMeatPreferenceService(meatId);
  const result = {
    id: meat.id,
    imageUrl: storage.mediaLink,
    title: meat.title,
    description: meat.description,
    maxParticipant: meat.maxParticipant,
    startTime: meat.startTime,
    endTime: meat.endTime,
    status: meat.status,
    locationDTO: new LocationDTO(data.latitude, data.longitude),
    totalParticipants: totalParticipants,
    role: role,
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
  findOneMeatService,
};
