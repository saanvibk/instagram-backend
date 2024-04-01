import { Router } from 'express';
import User from '../user/model.js';
import checkSession from '../middleware/checkSession.js';
import POST from './model.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

const upload = multer({ dest: 'uploads/' });
cloudinary.config({
  cloud_name: 'dmhhvmk1o',
  api_key: '769389196657878',
  api_secret: '3AW0erzwFBui8CNc7OKVS8WDTKA',
});

router.post(
  '/createPost',
  checkSession,
  upload.single('file'),
  async (req, res) => {
    const postCaption = req.body.caption;
    try {
      console.log(req.file);
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.session.user}/user_post`,
      });
      console.log(result);

      try {
        const userPost = await POST.create({
          post: result.secure_url,
          caption: postCaption,
          postedBy: req.session.user,
        });
        return res
          .status(200)
          .json({ msg: 'Post uploaded successfully', userPost });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Failed to upload Post' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading file to Cloudinary.');
    }
  },
);

router.get('/allpost', async (req, res) => {
  try {
    const posts = await POST.find();
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

export default router;
