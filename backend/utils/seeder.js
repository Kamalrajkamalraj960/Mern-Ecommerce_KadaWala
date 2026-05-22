import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const users = [
  {
    name: 'KadaWave Admin',
    email: 'kamalrajmanu@gmail.com',
    password: '12345678',
    role: 'admin',
  },
  {
    name: 'Hari Prasad',
    email: 'customer@kadawave.com',
    password: 'userpassword123',
    role: 'user',
  },
];

const products = [
  {
    title: 'Malabar Silk Kasavu Saree',
    description: 'An exquisite handwoven cream-and-gold traditional saree crafted from finest Mulberry silk. Features a classic thick gold zari border (kasavu), perfect for festive celebrations and heritage weddings.',
    price: 180,
    discountPrice: 155,
    category: 'Fashion',
    brand: 'KadaWave Heritage',
    stock: 12,
    ratings: 4.9,
    featured: true,
    sizes: ['Free Size'],
    colors: ['Cream & Gold'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Aranmula Mirror - Brass Valgannadi',
    description: 'Authentic handcrafted Aranmula Kannadi, a metal-alloy mirror made in Kerala. Classified as a Geographical Indication (GI) tag handicraft, it brings prosperity and luck. Mounted on a detailed brass frame.',
    price: 320,
    discountPrice: 295,
    category: 'Home Decor',
    brand: 'Heritage Artisans',
    stock: 5,
    ratings: 5.0,
    featured: true,
    sizes: ['Standard'],
    colors: ['Antique Brass'],
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544273677-c433136021d4?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Munnar Reserve Cardamom Tea',
    description: 'Single-origin premium black tea leaves harvested from the misty hills of Munnar, infused with aromatic ground cardamom pods. Offers a rich, bold flavor with warm, sweet undertones.',
    price: 24,
    discountPrice: 19,
    category: 'Spices & Teas',
    brand: 'High Range Estates',
    stock: 100,
    ratings: 4.8,
    featured: true,
    sizes: ['250g', '500g'],
    colors: ['Amber Brew'],
    images: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Modern Indigo Handloom Kurta',
    description: 'Breathable lightweight handloom cotton kurta colored in natural indigo dye. Features clean straight lines, minimalist coconut shell buttons, and classic Kerala weave patterns suitable for everyday styling.',
    price: 65,
    discountPrice: 49,
    category: 'Fashion',
    brand: 'KadaWave Modern',
    stock: 25,
    ratings: 4.7,
    featured: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Indigo Blue'],
    images: [
      'https://images.unsplash.com/photo-1597983073453-ef90a472f782?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Minimalist Coir & Jute Tote Bag',
    description: 'Eco-friendly chic tote bag crafted from durable golden coconut coir fibers and soft woven jute. Includes premium leather straps, cotton lining, and magnetic closure. Designed for sustainable luxury.',
    price: 45,
    discountPrice: 38,
    category: 'Accessories',
    brand: 'KadaWave Modern',
    stock: 40,
    ratings: 4.5,
    featured: false,
    sizes: ['Medium', 'Large'],
    colors: ['Natural Sand'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Teakwood Kathakali Dance Mask',
    description: 'Stunning wall-mount mask representation of the majestic Kathakali dance form, hand-carved in premium teakwood. Painted in vibrant acrylic green, red, and gold detailing by local artisans of Thrissur.',
    price: 150,
    discountPrice: 135,
    category: 'Home Decor',
    brand: 'Heritage Artisans',
    stock: 8,
    ratings: 4.9,
    featured: true,
    sizes: ['Standard'],
    colors: ['Vibrant Multi-color'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', // beach landscape fallback
      'https://images.unsplash.com/photo-1566121318594-a4f65f372c3d?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Nilgiri Whole Organic Cloves',
    description: 'Hand-picked organic whole cloves grown in the high altitudes of the Nilgiri hills. Intensely aromatic, rich in essential oils, and packed fresh in zero-waste reusable glass canisters.',
    price: 18,
    discountPrice: 14,
    category: 'Spices & Teas',
    brand: 'High Range Estates',
    stock: 75,
    ratings: 4.6,
    featured: false,
    sizes: ['150g'],
    colors: ['Dark Clove'],
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    title: 'Heritage Brass Nilavilakku',
    description: 'A traditional brass oil lamp widely used in Kerala. Standing 18 inches tall, this heavy-base lamp is polished to a brilliant gold shine, suitable for homes, entrances, and spiritual altars.',
    price: 85,
    discountPrice: 75,
    category: 'Home Decor',
    brand: 'Heritage Artisans',
    stock: 15,
    ratings: 4.9,
    featured: false,
    sizes: ['12 Inch', '18 Inch'],
    colors: ['Polished Gold'],
    images: [
      'https://images.unsplash.com/photo-1609252913962-b35b2e59600a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601647998801-e26048861285?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

const importData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database collections cleared.');

    // Seed Users
    const seededUsers = [];
    for (const u of users) {
      const newUser = await User.create(u);
      seededUsers.push(newUser);
    }
    console.log(`Successfully seeded ${seededUsers.length} users.`);

    // Seed Products
    const seededProducts = [];
    for (const p of products) {
      const newProduct = await Product.create(p);
      seededProducts.push(newProduct);
    }
    console.log(`Successfully seeded ${seededProducts.length} products.`);

    console.log('Data Import Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
