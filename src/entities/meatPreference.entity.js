function MeatPreference(
    id,
    meatId,
    preferenceId,
    createdDate,
    lastModifiedDate
  ) {
    this.id = id;
    this.meatId = meatId;
    this.preferenceId = preferenceId;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
  }
  
  module.exports = MeatPreference;