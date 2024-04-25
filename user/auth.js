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
  if (!checkPassword) {
    return res.status(400).json({ msg: 'Incorrect Password' });
  }

  req.session.visited = true;
  req.session.user = findUser._id;
  console.log(findUser);
  return res.status(200).json({ findUser });
});

router.post('/signup', async (req, res) => {
  let { email, fullname, username, password } = req.body;

  const hashedPassword = (password) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
  };
  password = hashedPassword(password);

  const user = new User({ email, fullname, username, password });

  try {
    const savedUser = await user.save();

    req.session.visited = true;
    req.session.user = savedUser._id;
    console.log(savedUser);

    res.status(200).json({ savedUser });
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', checkSession, async (req, res) => {
  try {
    await req.sessionStore.destroy(req.session.id);
    return res.status(200).json({ msg: 'Loggin Out ' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
