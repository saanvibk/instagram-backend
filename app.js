import express from 'express';
import connectDB from './db/connect.js';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import authRoutes from './user/controller.js';

const app = express();

const corsOptions = {
  credentials: true, // Allow credentials (cookies)
  origin: 'http://localhost:3000', // Update with your frontend URL
  exposedHeaders: ['set-cookie', 'ajax_redirect'],
  preflightContinue: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser('helloWorld'));
app.use(
  session({
    secret: 'instagram',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 30000,
    },
  }),
);
app.use(flash());

// Routes
app.use('/auth', authRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(6500, () => console.log('Server listening at 5500'));
  } catch (error) {
    console.log(error);
  }
};

start();
