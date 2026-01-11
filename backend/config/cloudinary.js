const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Configure immediately
configureCloudinary();

// Export both the configured instance and the configure function
module.exports = {
  cloudinary,
  configureCloudinary
};