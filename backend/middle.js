const { campSchema , reviewSchema} = require('./schemas.js');
const ExpressError = require('./helpers/expressError');
const model = require('./model/yelp');
const Review = require('./model/review')
const User = require('./model/users');
const { verifyToken } = require('./helpers/jwt');

module.exports.attachUserFromToken = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        const payload = verifyToken(token);

        if (payload?.id) {
            req.user = await User.findById(payload.id);
        }

        next();
    } catch (err) {
        next(err);
    }
}

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.user && !(req.isAuthenticated && req.isAuthenticated())){
        return res.status(401).json({ error: 'You must be logged in' });
    }
    next()
}


module.exports.validateCamp = ((req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    };
})

module.exports.normalizeCampgroundBody = (req, res, next) => {
    if (!req.body.campground) {
        req.body.campground = {
            title: req.body['campground[title]'],
            location: req.body['campground[location]'],
            price: req.body['campground[price]'],
            description: req.body['campground[description]']
        };
    }

    if (req.body.deleteImages && !Array.isArray(req.body.deleteImages)) {
        req.body.deleteImages = [req.body.deleteImages];
    }

    next();
}

module.exports. isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await model.findById(id)
    if (!camp) {
        return res.status(404).json({ error: 'Cannot find that campground!' });
    }

    if (!camp.author.equals(req.user._id)) {
        return res.status(403).json({ error: 'You do not have permission!' });
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: 'Cannot find that review!' });
    }

    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: 'You do not have permission to do that!' });
    }
    next();
}

module.exports.validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    };
})
