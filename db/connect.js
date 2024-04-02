import mongoose from 'mongoose';

const connectionString =
  'mongodb+srv://bksaanvi225:5BTH56mDoydHSaTo@cluster0.v7m4rha.mongodb.net/';
// 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3';
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
