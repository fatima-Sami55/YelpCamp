const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapError = require('../helpers/errorWraper');
const controllers = require('../controllers/rev')
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middle')



router.post('/', isLoggedIn, validateReview, wrapError(controllers.CreateR))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapError(controllers.deleteR))




module.exports = router;