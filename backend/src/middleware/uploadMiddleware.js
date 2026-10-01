import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /\.(jpe?g|png|webp|svg|gif|bmp|jfif|avif|heic|heif|ico|tiff?)$/i;
  const isImageExt = filetypes.test(path.extname(file.originalname).toLowerCase());
  const isImageMime = file.mimetype && (file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream');

  if (isImageExt || (file.mimetype && file.mimetype.startsWith('image/'))) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG, AVIF, HEIC, JFIF) are allowed!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
