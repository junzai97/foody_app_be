function MeatDTO(
    id,
    title,
    description,
    maxParticipant,
    startTime,
    endTime,
    preferenceIds,
    base64String,
    locationDTO,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxParticipant = maxParticipant;
    this.startTime = startTime;
    this.endTime = endTime;
    this.preferenceIds = preferenceIds;
    this.base64String = base64String;
    this.locationDTO = locationDTO;
  }
  
  module.exports = MeatDTO;