import { Router } from 'express';
import User from './model.js';
import checkSession from '../middleware/checkSession.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

const upload = multer({ dest: 'uploads/' });
cloudinary.config({
  cloud_name: 'dmhhvmk1o',
  api_key: '769389196657878',
  api_secret: '3AW0erzwFBui8CNc7OKVS8WDTKA',
});

router.get('/home', checkSession, (req, res) => {
  res.status(200).send('home');
});

router.get('/profile', checkSession, async (req, res) => {
  try {
    const userData = await User.findById(req.session.user);
    console.log(userData);
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
  }
});

router.post('/update', async (req, res) => {
  const userId = req.session.user;
  if (req.body.password) {
    return res.status(400).json({ error: 'Not allowed to change password' });
  }
  try {
    const findUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    return res.status(200).json({ findUser });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  '/uploadProfilePic',
  checkSession,
  upload.single('file'),
  async (req, res) => {
    try {
      console.log(req.file);
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.session.user}/profile_pics`,
      });

      const user = await User.findById(req.session.user);
      // Split the URL by '/'
      const parts = user.profilePic.split('/');

      // The Public ID is the last part of the URL before the file extension
      const publicIdWithExtension = parts[parts.length - 1];

      // Split the Public ID by '.' to remove the file extension
      const publicId = publicIdWithExtension.split('.')[0];

      console.log(publicId);
      const deleteFileFromCloudinary = async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(
            `${req.session.user}/profile_pics/${publicId}`,
          );
          console.log(result);
          // Handle success or error
        } catch (error) {
          console.error(error);
          // Handle error
        }
      };

      deleteFileFromCloudinary(publicId);
      // Send the Cloudinary URL of the uploaded file in the response
      await User.findOneAndUpdate(
        { _id: req.session.user },
        {
          profilePic: result.secure_url,
        },
        {
          new: true,
        },
      );
      res.status(200).json({ profilePicUrl: result.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading file to Cloudinary.');
    }
  },
);

export default router;
