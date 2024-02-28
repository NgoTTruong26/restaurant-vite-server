import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { extname } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
console.log(process.env.CLOUDINARY_NAME);
const storage: any = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: process.env.CLOUDINARY_FOLDER,
    allowedFormats: ['jpeg', 'png', 'jpg'],
  }),
});

export const upload = multer({
  storage,
  limits: {
    files: 1,
    fieldSize: 5 * 1000 * 1000,
  },
  fileFilter(req, file, callback) {
    if (!['png', 'jpg', 'jpeg'].includes(extname(file.originalname).slice(1))) {
      console.log('Only images are allowed');
      return callback(new Error('Only images are allowed'));
    }

    callback(null, true);
  },
});
