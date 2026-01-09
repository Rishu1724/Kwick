const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage: storage });

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (fileBuffer, folder = 'olx_app') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { width: 800, height: 600, crop: 'limit' } // Limit size while maintaining quality
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pass the file buffer to Cloudinary
    uploadStream.end(fileBuffer);
  });
};

// Middleware to handle single image upload to Cloudinary
const uploadSingleImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const result = await uploadImageToCloudinary(req.file.buffer, 'avatars');
    req.cloudinaryResult = result;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Error uploading image to Cloudinary' });
  }
};

// Middleware to handle multiple image uploads to Cloudinary
const uploadMultipleImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map(file => 
      uploadImageToCloudinary(file.buffer, 'products')
    );
    
    const results = await Promise.all(uploadPromises);
    req.cloudinaryResults = results;
    next();
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    res.status(500).json({ message: 'Error uploading images to Cloudinary' });
  }
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  uploadImageToCloudinary
};