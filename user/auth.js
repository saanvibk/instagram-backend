import { Router } from 'express';
import User from './model.js';
import bcryptjs from 'bcryptjs';
import POST from '../post/model.js';
import checkSession from '../middleware/checkSession.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    return res.status(401).json({ msg: 'User not Found' });
  }
  const checkPassword = await bcryptjs.compare(password, findUser.password);
  console.log(checkPassword);
  if (!checkPassword) {
    return res.status(400).json({ msg: 'Incorrect Password' });
  }

  req.session.visited = true;
  req.session.user = findUser._id;
  console.log('session =', req.session);
  console.log('session ID =', req.session.id);
  return res.status(200).json(findUser);
});

router.post('/signup', async (req, res) => {
  let { email, fullname, username, password } = req.body;

  const hashedPassword = (password) => {
    console.log(password);
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
  };
  password = hashedPassword(password);

  const user = new User({ email, fullname, username, password });
  console.log('user');

  try {
    const savedUser = await user.save();

    req.session.visited = true;
    req.session.user = savedUser._id;
    console.log(savedUser);

    res.status(200).json({ savedUser });
  } catch (error) {
    console.log(error);
  }
  console.log('session ID =', req.session.id);
});

router.get('/logout', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'User not logged in ' });
  }
  try {
    await req.sessionStore.destroy(req.session.id);
    return res.status(200).json({ msg: 'Loggin Out ' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

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
