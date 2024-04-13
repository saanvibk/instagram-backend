import mongoose from 'mongoose';

const connectionString =
  'mongodb+srv://bksaanvi225:5BTH56mDoydHSaTo@cluster1.hm494kv.mongodb.net/instagram';

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
