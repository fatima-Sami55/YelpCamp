if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const ExpressError = require('./helpers/expressError');
const passport = require('passport');
const localS = require('passport-local');
const User = require('./model/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpdb';

const sanitizeOptions = { replaceWith: '_' };
const sanitizeRequest = (req, res, next) => {
    ['body', 'params', 'headers'].forEach((key) => {
        if (req[key]) {
            req[key] = mongoSanitize.sanitize(req[key], sanitizeOptions);
        }
    });

    if (req.query) {
        mongoSanitize.sanitize(req.query, sanitizeOptions);
    }

    next();
}

const auth = require('./routes/auth')
const camps = require('./routes/camps');
const reviews = require('./routes/reviews');
const { attachUserFromToken } = require('./middle');

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Database connected!')
    })
    .catch(err => {
        console.error('Database connection error:', err)
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(sanitizeRequest);
app.use(helmet());

app.use(passport.initialize());
passport.use(new localS(User.authenticate()));
app.use(attachUserFromToken);

app.get('/mapbox-token', (req, res) => {
    res.json({ token: process.env.MAPBOX_TOKEN || '' });
})

app.use('/', auth)
app.use('/campGround', camps);
app.use('/campGround/:id/reviews', reviews);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to YelpCamp API' })
})

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No! something went wrong'
    res.status(statusCode).json({ error: err.message });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
