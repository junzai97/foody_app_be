function Storage(
  id,
  fileName,
  bucket,
  media_link,
  createdDate,
  lastModifiedDate
) {
  this.id = id;
  this.fileName = fileName;
  this.bucket = bucket;
  this.media_link = media_link;
  this.createdDate = createdDate;
  this.lastModifiedDate = lastModifiedDate;
}

module.exports = Storage;
