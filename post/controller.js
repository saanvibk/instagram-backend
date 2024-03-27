import { Router } from 'express';
import User from '../user/model.js';
import checkSession from '../middleware/checkSession.js';
import POST from './model.js';

const router = Router();

router.post('/post', checkSession, (req, res) => {
  const { body, photo } = req.body;

  if (!body || !photo) {
    return res.status(400).json({ error: 'Please fill all the form' });
  }

  const post = new POST({ body, photo, postedBy: req.session.user });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => console.log(err));
});

router.get('/allpost', async (req, res) => {
  try {
    const posts = await POST.find();
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

export default router;
