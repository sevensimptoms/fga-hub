"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const modules_1 = __importDefault(require("./modules"));
const protect_route_1 = require("./middlewares/protect-route");
const service_exception_1 = require("./utils/service-exception");
const user_model_1 = __importDefault(require("./models/user.model"));
const redis_1 = __importDefault(require("./utils/redis"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Session and Flash
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
// Routes
app.use(modules_1.default);
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
        throw new service_exception_1.BadRequestException('Missing or invalid hash parameter');
    }
    const key = `verify:${hash}`;
    const payload = await redis_1.default.get(key);
    if (!payload) {
        throw new service_exception_1.BadRequestException('Invalid or expired verification link');
    }
    let userId, verificationToken;
    try {
        // ({ userId, verificationToken } = JSON.parse(payload));
    }
    catch (err) {
        console.error('Failed to parse Redis payload:', err);
        throw new service_exception_1.BadRequestException('Corrupted verification data');
    }
    if (hash !== verificationToken) {
        throw new service_exception_1.BadRequestException('Invalid or expired verification link');
    }
    const user = await user_model_1.default.findOne({ _id: userId }).select('emailVerified');
    if (!user) {
        throw new service_exception_1.BadRequestException('Invalid or expired verification link');
    }
    if (user.emailVerified) {
        throw new service_exception_1.BadRequestException('Email is already verified');
    }
    await Promise.all([
        user_model_1.default.updateOne({ _id: user._id }, { emailVerified: true }),
        redis_1.default.del(key),
    ]);
    _req.flash('success', 'Account activation successful. You can now log in.');
    res.render('auth/login');
});
app.get('/dashboard', protect_route_1.protectRoute, (_req, res) => {
    const user = _req.user;
    res.render('dashboard.ejs', { user });
});
app.get('/profile', protect_route_1.protectRoute, (_req, res) => {
    const user = _req.user;
    res.render('profile', { user });
});
app.get('/content', (_req, res) => {
    res.render('content');
});
app.get('/checkout', (_req, res) => {
    res.render('checkout');
});
exports.default = app;
//# sourceMappingURL=app.js.map