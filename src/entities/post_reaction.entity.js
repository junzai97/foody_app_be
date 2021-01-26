function PostReaction(
    id,
    post_id,
    user_id,
    post_reaction,
    createdDate,
    lastModifiedDate
  ) {
    this.id = id;
    this.post_id = post_id;
    this.user_id = user_id;
    this.post_reaction = post_reaction;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
  }
  
  module.exports = PostReaction;