function MeatDTO(
    id,
    title,
    description,
    maxParticipant,
    startTime,
    endTime,
    base64String,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxParticipant = maxParticipant;
    this.startTime = startTime;
    this.endTime = endTime;
    this.base64String = base64String;
  }
  
  module.exports = MeatDTO;