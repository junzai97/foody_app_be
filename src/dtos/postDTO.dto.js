function PostDTO(
    id,
    user_id,
    images,
    description,
    services,
    cleanliness,
    taste,
    price,

){
    this.id = id;
    this.user_id = user_id;
    this.images = images;
    this.description = description;
    this.services = services;
    this.cleanliness = cleanliness;
    this.taste = taste;
    this.price = price;
}

module.exports = PostDTO;