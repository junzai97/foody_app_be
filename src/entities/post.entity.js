function Post(
    id,
    user_id,
    username,
    images,
    description,
    services,
    cleanliness,
    taste,
    price,
    createdDate,
    lastModifiedDate
){
    this.id = id;
    this.user_id = user_id;
    this.username = username;
    this.images = images;
    this.description = description;
    this.services = services;
    this.cleanliness = cleanliness;
    this.taste = taste;
    this.price = price;
    this.createdDate = createdDate;
    this.lastModifiedDate = lastModifiedDate;
}

module.exports = Post;