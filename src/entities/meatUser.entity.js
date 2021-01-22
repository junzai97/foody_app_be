function MeatUser(
    id,
    meatId,
    userId,
    role,
    status,
    createdDate,
    lastModifiedDate
  ) {
    this.id = id;
    this.meatId = meatId;
    this.userId = userId;
    this.role = role;
    this.status = status;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
  }
  
  module.exports = MeatUser;