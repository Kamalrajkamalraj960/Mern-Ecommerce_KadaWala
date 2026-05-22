import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary Configured Successfully');
} else {
  console.warn('WARNING: Cloudinary credentials not configured. Using Mock Image Upload fallback.');
}

/**
 * Uploads a local file buffer to Cloudinary, or falls back to mock image URLs.
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (fileBuffer) => {
  if (!isCloudinaryConfigured) {
    // Generate a fallback premium dummy image URL
    // We will return a placeholder URL or a random premium stock image
    const fallbacks = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', // shoes
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', // watch
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80', // glasses
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80', // headphone
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80', // black shoe
    ];
    const randomUrl = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return randomUrl;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'kadawave_products' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
