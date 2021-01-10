function Preference(
    id,
    name,
    description,
    createdDate,
    lastModifiedDate
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
  }
  
  module.exports = Preference;