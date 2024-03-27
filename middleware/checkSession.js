const checkSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ msg: 'Session expired' });
  }
};

export default checkSession;
