function Storage(
  id,
  fileName,
  bucket,
  mediaLink,
  createdDate,
  lastModifiedDate
) {
  this.id = id;
  this.fileName = fileName;
  this.bucket = bucket;
  this.mediaLink = mediaLink;
  this.createdDate = createdDate;
  this.lastModifiedDate = lastModifiedDate;
}

module.exports = Storage;
