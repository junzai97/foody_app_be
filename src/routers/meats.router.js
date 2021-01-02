const express = require("express");
const router = express.Router();
const { toMysqlTimestampString } = require("../utils/mysql.utils");
const { createMeat } = require("../repository/meats.repostitory");
const { createStorage } = require("../repository/storage.repostitory");
const Meat = require("../entities/meat.entity");
const MeatStatus = require("../enums/meatStatus.enums");
const AttachmentType = require("../enums/attachmentType.enum");

router.post("/meat", async (req, res) => {
  const meatDTO = req.body;
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
    res
      .status(200)
      .send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
