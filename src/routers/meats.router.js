const express = require("express");
const router = express.Router();
const { toMysqlTimestampString } = require("../utils/mysql.utils");
const { hasMissingKey } = require("../utils/compare.utils");
const {
  createMeat,
  findOneMeat,
  cancelMeat,
} = require("../repository/meats.repostitory");
const {
  createStorage,
  findOneStorage,
} = require("../repository/storage.repostitory");
const { createMeatLocation } = require("../services/firestore.service");
const Meat = require("../entities/meat.entity");
const MeatDTO = require("../dtos/meatDTO.dto");
const MeatStatus = require("../enums/meatStatus.enum");
const AttachmentType = require("../enums/attachmentType.enum");
const LocationDTO = require("../dtos/locationDTO.dto");

router.post("/meat", async (req, res) => {
  const meatDTO = req.body;
  const isInvalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), ["id"]);
  const isInvalidLocationDTO = hasMissingKey(
    meatDTO.locationDTO,
    new LocationDTO()
  );
  if (isInvalidMeatDTO || isInvalidLocationDTO) {
    res.status(400).send("invalid request body");
    return;
  }
  try {
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
    const savedResult = await createMeat(meat);
    const firestoreData = await createMeatLocation(
      savedResult.insertId,
      meatDTO.locationDTO
    );
    res
      .status(201)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/meat/:meatId", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const meat = await findOneMeat(meatId);
    const storage = await findOneStorage(meat.imageStorageId);
    const result = {
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
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/meat/:meatId/cancel", async (req, res) => {
  try {
    const meatId = req.params.meatId;
    const mysqlResponse = await cancelMeat(meatId);
    if (mysqlResponse.affectedRows < 1) {
      res.status(400).send("no meat is cancelled. Is meat exist?");
      return;
    }
    res.status(200).send(mysqlResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
