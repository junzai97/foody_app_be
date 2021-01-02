const express = require("express");
const router = express.Router();
const { toMysqlTimestampString } = require("../utils/mysql.utils");
const { createMeat } = require("../repository/meats.repostitory");
const Meat = require("../entities/meat.entity");
const MeatDTO = require("../dtos/meatDTO.dto");
const MeatStatus = require("../enums/meatStatus.enums");

router.post("/meat", async (req, res) => {
  const meatDTO = req.body;
  if (!meatDTO instanceof MeatDTO) {
    res.status(400).send("invalid request body");
  }
  try {
    const meat = new Meat(
      null,
      1,
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
    res.status(200).send(`Meat with id ${savedResult.insertId} saved succesfully`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
