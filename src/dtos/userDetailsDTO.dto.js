function userDetailsDTO(
    base64String,
    gender,
    biography
){
    this.base64String = base64String,
    this.gender = gender,
    this.biography = biography
}

module.exports = userDetailsDTO;