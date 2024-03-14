import { Router } from 'express';
import User from './model.js';
import bcryptjs from 'bcryptjs';

const router = Router();

const checkSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ msg: 'Session expired' });
  }
};

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
  console.log('session =', req.session);
  console.log('session ID =', req.session.id);
});

router.get('/home', checkSession, (req, res) => {
  res.status(200).send('home');
});

export default router;
