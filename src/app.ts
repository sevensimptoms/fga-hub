import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import modules from './modules';
import { protectRoute } from './middlewares/protect-route';
import { BadRequestException } from './utils/service-exception';
import User from './models/user.model';
import redisClient from './utils/redis';

dotenv.config();

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session and Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(modules);

app.get('/', (_req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/register', (_req, res) => {
  res.render('auth/register');
});

app.get('/login', (_req, res) => {
  res.render('auth/login');
});

app.get('/registration-successful', (_req, res) => {
  res.render('auth/regSuccess');
});

app.get('/confirm-email', async (_req, res) => {
  const hash = _req.query.hash;

  if (!hash || typeof hash !== 'string') {
    throw new BadRequestException('Missing or invalid hash parameter');
  }

  const key = `verify:${hash}`;
  const payload = await redisClient.get(key);

  if (!payload) {
    throw new BadRequestException('Invalid or expired verification link');
  }

  let userId, verificationToken;
  try {
    // ({ userId, verificationToken } = JSON.parse(payload));
  } catch (err) {
    console.error('Failed to parse Redis payload:', err);
    throw new BadRequestException('Corrupted verification data');
  }

  if (hash !== verificationToken) {
    throw new BadRequestException('Invalid or expired verification link');
  }

  const user = await User.findOne({ _id: userId }).select('emailVerified');
  if (!user) {
    throw new BadRequestException('Invalid or expired verification link');
  }

  if (user.emailVerified) {
    throw new BadRequestException('Email is already verified');
  }
  
  await Promise.all([
    User.updateOne({ _id: user._id }, { emailVerified: true }),
    redisClient.del(key),
  ]);
  _req.flash('success', 'Account activation successful. You can now log in.');
  res.render('auth/login');
});


app.get('/dashboard', protectRoute, (_req, res) => {
  const user = _req.user;
  res.render('dashboard.ejs',  { user });
});

app.get('/profile', protectRoute, (_req, res) => {
  const user = _req.user;
  res.render('profile', { user });
});

app.get('/content', (_req, res) => {
  res.render('content');
});

app.get('/checkout', (_req, res) => {
  res.render('checkout');
});

export default app;
