import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sendOrderEmail from '../utils/sendEmail.js';

// @desc    Create new order (with database price validation and stock deduction)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      res.status(400);
      return next(new Error('No order items provided'));
    }

    let calculatedTotalPrice = 0;
    const verifiedProducts = [];

    // Verify product prices and stock against database
    for (const item of products) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        res.status(404);
        return next(new Error(`Product not found: ${item.product}`));
      }

      // Check stock
      if (dbProduct.stock < item.quantity) {
        res.status(400);
        return next(
          new Error(
            `Insufficient stock for product: ${dbProduct.title}. Available: ${dbProduct.stock}`
          )
        );
      }

      // Use discount price if available
      const currentPrice =
        dbProduct.discountPrice > 0 &&
          dbProduct.discountPrice < dbProduct.price
          ? dbProduct.discountPrice
          : dbProduct.price;

      calculatedTotalPrice += currentPrice * item.quantity;

      verifiedProducts.push({
        product: dbProduct._id,
        quantity: item.quantity,
        price: currentPrice,
        title: dbProduct.title,
        image: dbProduct.images[0],
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      });

      // Deduct stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      products: verifiedProducts,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice: calculatedTotalPrice,
    });

    const createdOrder = await order.save();

    // Get full user details
    const user = await User.findById(req.user._id);

    // Send Admin Email
    await sendOrderEmail({
      name: user.name,
      email: user.email,
      address: `
        ${shippingAddress.address},
        ${shippingAddress.city},
        ${shippingAddress.postalCode},
        ${shippingAddress.country}
      `,
      products: verifiedProducts,
      totalAmount: calculatedTotalPrice,
    });

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'title images brand slug');

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    // Only allow owner or admin to view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to view this order'));
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'title images slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .populate('products.product', 'title images brand slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    // If order is cancelled, return inventory
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Stats (Admin only)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total sales from delivered/processing/shipped orders (exclude Cancelled)
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Get product distribution by category
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Get order status summary
    const statusStats = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // Get 6 recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        stats: {
          totalSales,
          totalOrders,
          totalProducts,
          totalUsers,
        },
        categoryStats,
        statusStats,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
