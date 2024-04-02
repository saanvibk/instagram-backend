import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  profilePic: {
    type: String,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7-_ejhfjun3WS6ya6cX5xO38IAZcA5S8em6u-wQHQwrijW4jrI57-NDbbszUJXhZjbo&usqp=CAU',
  },
});

export default mongoose.model('user', userSchema);
