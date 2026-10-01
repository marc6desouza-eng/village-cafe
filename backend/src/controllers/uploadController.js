import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_UPLOADS = path.resolve(__dirname, '../../uploads');
const FRONTEND_UPLOADS = path.resolve(__dirname, '../../../frontend/public/uploads');

// Ensure directories exist
if (!fs.existsSync(BACKEND_UPLOADS)) fs.mkdirSync(BACKEND_UPLOADS, { recursive: true });
if (!fs.existsSync(FRONTEND_UPLOADS)) fs.mkdirSync(FRONTEND_UPLOADS, { recursive: true });

const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'village-cafe',
        public_id: path.parse(filename).name + '_' + Date.now(),
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const saveBufferToDisk = (buffer, originalname) => {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const cleanBase = path.basename(originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanBase}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}${ext}`;
  const targetBackend = path.join(BACKEND_UPLOADS, filename);
  const targetFrontend = path.join(FRONTEND_UPLOADS, filename);

  fs.writeFileSync(targetBackend, buffer);
  try {
    fs.writeFileSync(targetFrontend, buffer);
  } catch (e) {
    // frontend dir optional in production deployment
  }

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
    storageType: 'local',
  };
};

export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file was provided.' });
    }

    if (isCloudinaryConfigured) {
      const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary.',
        url: result.secure_url,
        data: { url: result.secure_url, publicId: result.public_id },
        publicId: result.public_id,
        storageType: 'cloudinary',
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } else {
      const diskResult = saveBufferToDisk(req.file.buffer, req.file.originalname);
      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully (persistent local storage).',
        url: diskResult.url,
        data: { url: diskResult.url, publicId: diskResult.publicId },
        publicId: diskResult.publicId,
        storageType: 'local',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }

    const uploaded = [];

    for (const file of req.files) {
      if (isCloudinaryConfigured) {
        const result = await uploadBufferToCloudinary(file.buffer, file.originalname);
        uploaded.push({
          url: result.secure_url,
          publicId: result.public_id,
          storageType: 'cloudinary',
          originalname: file.originalname,
        });
      } else {
        const diskResult = saveBufferToDisk(file.buffer, file.originalname);
        uploaded.push({
          url: diskResult.url,
          publicId: diskResult.publicId,
          storageType: 'local',
          originalname: file.originalname,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `${uploaded.length} image(s) uploaded successfully.`,
      data: uploaded,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { publicId, url } = req.body;

    if (isCloudinaryConfigured && publicId && !publicId.endsWith('.jpg') && !publicId.endsWith('.png')) {
      await cloudinary.uploader.destroy(publicId);
    } else if (url && url.startsWith('/uploads/')) {
      const filename = path.basename(url);
      const filePath = path.join(BACKEND_UPLOADS, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true, message: 'Image deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
