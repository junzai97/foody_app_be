function Meat(
  id,
  imageStorageId,
  title,
  description,
  maxParticipant,
  startTime,
  endTime,
  status,
  createdDate,
  lastModifiedDate
) {
  this.id = id;
  this.imageStorageId = imageStorageId;
  this.title = title;
  this.description = description;
  this.maxParticipant = maxParticipant;
  this.startTime = startTime;
  this.endTime = endTime;
  this.status = status;
  this.createdDate = createdDate;
  this.lastModifiedDate = lastModifiedDate;
}

module.exports = Meat;