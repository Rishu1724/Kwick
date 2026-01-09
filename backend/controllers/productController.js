const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    subCategory,
    price,
    condition,
    location,
    tags,
  } = req.body;

  // Check if user is a seller
  if (req.user.role !== 'seller' && req.user.role !== 'both') {
    res.status(401);
    throw new Error('Not authorized as a seller');
  }

  // Handle image uploads to Cloudinary
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    try {
      // Upload each image to Cloudinary
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'products' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      });
      
      uploadedImages = await Promise.all(uploadPromises);
    } catch (uploadError) {
      console.error('Product image upload error:', uploadError);
      res.status(500);
      throw new Error('Error uploading product images');
    }
  }
  
  // Use uploaded images or fallback to images passed in request body
  const images = uploadedImages.length > 0 ? uploadedImages : (req.body.images || []);

  const product = new Product({
    sellerId: req.user._id,
    title,
    description,
    category,
    subCategory,
    price,
    images,
    condition,
    location,
    tags,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const sortBy = req.query.sortBy || 'newest';

  // Build filter object
  let filter = {};

  // Keyword search
  if (req.query.keyword) {
    filter.title = {
      $regex: req.query.keyword,
      $options: 'i',
    };
  }

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice);
    }
  }

  // Condition filter
  if (req.query.condition) {
    filter.condition = req.query.condition;
  }

  // Location filter
  if (req.query.location) {
    filter['location.city'] = {
      $regex: req.query.location,
      $options: 'i',
    };
  }

  // Featured products filter
  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  // Build sort object based on sortBy parameter
  let sort = {};
  switch (sortBy) {
    case 'price-asc':
      sort = { price: 1 };
      break;
    case 'price-desc':
      sort = { price: -1 };
      break;
    case 'popularity':
      sort = { views: -1 };
      break;
    case 'newest':
    default:
      sort = { createdAt: -1 };
      break;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    subCategory,
    price,
    condition,
    location,
    tags,
    status,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user is the seller
    if (product.sellerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.price = price || product.price;
    product.condition = condition || product.condition;
    product.location = location || product.location;
    product.tags = tags || product.tags;
    product.status = status || product.status;
    
    // Handle image uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      try {
        // Upload each image to Cloudinary
        const uploadPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: 'image', folder: 'products' },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            );
            uploadStream.end(file.buffer);
          });
        });
        
        const uploadedImages = await Promise.all(uploadPromises);
        // Append new images to existing ones or replace them
        product.images = [...(product.images || []), ...uploadedImages];
      } catch (uploadError) {
        console.error('Product image upload error:', uploadError);
        res.status(500);
        throw new Error('Error uploading product images');
      }
    } else {
      // Use images from request body if no new files uploaded
      if (req.body.images) {
        product.images = req.body.images;
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user is the seller
    if (product.sellerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Product.countDocuments({ category: req.params.category });
  const products = await Product.find({ category: req.params.category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};