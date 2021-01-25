function Comment(
    id,
    user_id,
    post_id,
    comment,
    createdDate,
    lastModifiedDate
){
    this.id = id;
    this.user_id = user_id;
    this.post_id = post_id;
    this.comment = comment;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
}

module.exports = Comment;