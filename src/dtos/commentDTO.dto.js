function commentDTO(
    id,
    user_id,
    post_id,
    comment,
) {
    this.id = id,
    this.user_id = user_id,
    this.post_id = post_id,
    this.comment = comment
}

module.exports = commentDTO;