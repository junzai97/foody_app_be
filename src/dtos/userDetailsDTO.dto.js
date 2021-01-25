function userDetailsDTO(biography, locationDTO, base64String, preferenceIds) {
  (this.biography = biography),
    (this.locationDTO = locationDTO),
    (this.base64String = base64String),
    (this.preferenceIds = preferenceIds);
}

module.exports = userDetailsDTO;
