import { Request, Response } from 'express';
import { upload } from '../../configs/cloudinary.config';

class UploadController {
  uploadImage = async (req: Request, res: Response) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.log(err);

        return res
          .status(400)
          .send({ success: false, message: 'Only image are allowed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      res.send(req.file.path);
    });
  };
}

export default UploadController;
