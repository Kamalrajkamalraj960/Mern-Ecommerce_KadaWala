import Product from '../models/Product.js';
import { uploadImage } from '../config/cloudinary.js';

// @desc    Get all products (with search, category, and sorting filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by search query (title or brand or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by featured
    if (featured) {
      query.featured = featured === 'true';
    }

    // Define Sorting
    let sortBy = { createdAt: -1 }; // default: latest
    if (sort) {
      if (sort === 'priceAsc') {
        sortBy = { price: 1 };
      } else if (sort === 'priceDesc') {
        sortBy = { price: -1 };
      } else if (sort === 'ratings') {
        sortBy = { ratings: -1 };
      }
    }

    const products = await Product.find(query).sort(sortBy);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product (by ID or Slug)
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let product;
    // Check if the parameter is a valid MongoDB ObjectId
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to parse arrays from multipart form data
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [field];
  } catch (e) {
    // Comma-separated fallback
    return field.split(',').map(item => item.trim()).filter(Boolean);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    // Parse numeric and array fields from multipart form data
    const sizes = parseArrayField(req.body.sizes);
    const colors = parseArrayField(req.body.colors);

    // Handle files upload
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file.buffer));
      imageUrls = await Promise.all(uploadPromises);
    } else if (req.body.images) {
      // Fallback if images passed as array of strings
      imageUrls = parseArrayField(req.body.images);
    }

    if (imageUrls.length === 0) {
      // Provide a default image if none uploaded or specified
      imageUrls.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600');
    }

    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      discountPrice: Number(req.body.discountPrice || 0),
      category: req.body.category,
      brand: req.body.brand,
      stock: Number(req.body.stock || 0),
      ratings: Number(req.body.ratings || 5),
      featured: req.body.featured === 'true' || req.body.featured === true,
      sizes,
      colors,
      images: imageUrls,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    // Parse array fields
    const sizes = req.body.sizes !== undefined ? parseArrayField(req.body.sizes) : product.sizes;
    const colors = req.body.colors !== undefined ? parseArrayField(req.body.colors) : product.colors;

    // Handle image updates
    let imageUrls = [...product.images];
    
    // If user uploaded new files
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage(file.buffer));
      const newUrls = await Promise.all(uploadPromises);
      
      // If "replace" is set, replace all images, else append
      if (req.body.replaceImages === 'true') {
        imageUrls = newUrls;
      } else {
        imageUrls = [...imageUrls, ...newUrls];
      }
    } else if (req.body.images !== undefined) {
      // If client passed a list of remaining image URLs (e.g. after deleting some in front-end)
      imageUrls = parseArrayField(req.body.images);
    }

    const updatedData = {
      title: req.body.title || product.title,
      description: req.body.description || product.description,
      price: req.body.price !== undefined ? Number(req.body.price) : product.price,
      discountPrice: req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : product.discountPrice,
      category: req.body.category || product.category,
      brand: req.body.brand || product.brand,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : product.stock,
      ratings: req.body.ratings !== undefined ? Number(req.body.ratings) : product.ratings,
      featured: req.body.featured !== undefined ? (req.body.featured === 'true' || req.body.featured === true) : product.featured,
      sizes,
      colors,
      images: imageUrls,
    };

    // Use save() so that slug is re-generated if title changed
    Object.assign(product, updatedData);
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
