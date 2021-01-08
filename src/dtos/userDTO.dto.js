function UserDTO(
    id,
    username,
    email,
    password,
    gender,
    biography,
    base64String
){
    this.id = id,
    this.username = username,
    this.email = email,
    this.password = password,
    this.gender = gender,
    this.biography = biography, 
    this.base64String = base64String
}

module.exports = UserDTO;