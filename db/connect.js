import mongoose from 'mongoose';

const connectionString =
  'mongosh "mongodb+srv://cluster0.v7m4rha.mongodb.net/" --apiVersion 1 --username bksaanvi225 --password 5BTH56mDoydHSaTo';

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
