function User(
    id,
    imageStorageId,
    username,
    email,
    password,
    gender,
    biography,
    createdDate,
    lastModifiedDate
){
    this.id = id,
    this.imageStorageId = imageStorageId,
    this.username = username,
    this.email = email,
    this.password = password,
    this.gender = gender,
    this.biography = biography,
    this.createdDate = createdDate,
    this.lastModifiedDate = lastModifiedDate
}

module.exports = User;