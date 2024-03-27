import express from 'express';
import connectDB from './db/connect.js';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './user/auth.js';
import userProfile from './user/controller.js';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const app = express();

const corsOptions = {
  credentials: true, // Allow credentials (cookies)
  origin: 'http://localhost:3000', // Update with your frontend URL
  // exposedHeaders: ['set-cookie', 'ajax_redirect'],
  // preflightContinue: true,
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser('helloWorld'));
app.use(
  session({
    secret: 'saanvi',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 4000000,
    },

    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/session',
    }),
  }),
);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userProfile);

const start = async () => {
  try {
    await connectDB();
    app.listen(6500, () => console.log('Server listening at 5500'));
  } catch (error) {
    console.log(error);
  }
};

start();
