function PostDTO(
    id,
    user_id,
    description,
    services,
    cleanliness,
    taste,
    price,

){
    this.id = id;
    this.user_id = user_id;
    this.description = description;
    this.services = services;
    this.cleanliness = cleanliness;
    this.taste = taste;
    this.price = price;
}

module.exports = PostDTO;