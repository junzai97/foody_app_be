function PostStroage(
    id,
    post_id,
    storage_id,
    createdDate,
    lastModifiedDate
  ) {
    this.id = id;
    this.post_id = post_id;
    this.storage_id = storage_id;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
  }
  
module.exports = PostStroage;