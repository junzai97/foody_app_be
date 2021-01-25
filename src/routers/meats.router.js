const express = require("express");
const router = express.Router();
const { toMysqlTimestampString } = require("../utils/mysql.utils");
const { hasMissingKey } = require("../utils/compare.utils");
const { createMeat } = require("../repository/meats.repostitory");
const { createStorage } = require("../repository/storage.repostitory");
const { createMeatLocation } = require("../services/firestore.service");
const Meat = require("../entities/meat.entity");
const MeatDTO = require("../dtos/meatDTO.dto");
const MeatStatus = require("../enums/meatStatus.enums");
const AttachmentType = require("../enums/attachmentType.enum");
const LocationDTO = require("../dtos/locationDTO.dto");

router.post("/meat", async (req, res) => {
  const meatDTO = req.body;
  const invalidMeatDTO = hasMissingKey(meatDTO, new MeatDTO(), ["id"]);
  const invalidLocationDTO = hasMissingKey(meatDTO.locationDTO, new LocationDTO());
  if (invalidMeatDTO || invalidLocationDTO) {
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
    const firestoreData = await createMeatLocation(savedResult.insertId, meatDTO.locationDTO)
    res
      .status(201)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
