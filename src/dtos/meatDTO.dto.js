function MeatDTO(
    id,
    title,
    description,
    maxParticipant,
    startTime,
    endTime,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxParticipant = maxParticipant;
    this.startTime = startTime;
    this.endTime = endTime;
  }
  
  module.exports = MeatDTO;