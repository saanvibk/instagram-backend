import mongoose from 'mongoose';

const connectionString = 'mongodb://127.0.0.1:27017/instagram';

const connectDB = () => {
  return mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected'))
    .catch((error) => console.log(console.log(error)));
};

export default connectDB;
