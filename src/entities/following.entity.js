function Following(
    id,
    followerUserId,
    followingUserId,
    createdDate
){
    this.id = id,
    this.followerUserId = followerUserId,
    this.followingUserId = followingUserId,
    this.createdDate = createdDate
}

module.exports = Following;