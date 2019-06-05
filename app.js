const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
const { sequelize } = require('./models');

// Initialization
const app = express();
require('dotenv').config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 9001);
const passportConfig = require('./passport');
passportConfig(passport);
sequelize.sync();

// Middlewares
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    store: new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
        logErrors: true
    })
}

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true;  // for https
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello');
    logger.error(err.message);
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' Listening....');
});