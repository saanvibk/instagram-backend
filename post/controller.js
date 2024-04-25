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
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.session.user}/user_post`,
      });
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

router.get('/allpost', checkSession, async (req, res) => {
  const id = req.session.user;
  try {
    const posts = await POST.find()
      .populate('postedBy')
      .populate('comments.postedBy');

    return res.status(200).json({ posts, user: { id } });
  } catch (error) {
    console.log(error);
  }
});

router.get('/userPosts', checkSession, async (req, res) => {
  try {
    const userPosts = await POST.find({ postedBy: req.session.user });
    return res.status(200).json({ userPosts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'No post available' });
  }
});

router.put('/comment', checkSession, async (req, res) => {
  const comment = {
    comment: req.body.comment,
    postedBy: req.session.user,
  };
  try {
    const updateComment = await POST.findOneAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: comment } },
      {
        new: true,
      },
    )
      .populate('comments.postedBy')
      .populate('postedBy');
    return res.status(200).json({ updateComment });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Error while posting comment' });
  }
});

router.put('/like', checkSession, async (req, res) => {
  try {
    const updateLike = await POST.findOneAndUpdate(
      { _id: req.body.postId },
      {
        $push: { likes: req.session.user },
      },
      {
        new: true,
      },
    );
    const userID = req.session.user;

    return res.status(200).json({ updateLike, userID });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Failed to upated Likes' });
  }
});

router.put('/unlike', checkSession, async (req, res) => {
  try {
    const updateLike = await POST.findOneAndUpdate(
      { _id: req.body.postId },
      {
        $pull: { likes: req.session.user },
      },
      {
        new: true,
      },
    );
    return res.status(200).json({ updateLike });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: 'Failed to upated Likes' });
  }
});

export default router;
