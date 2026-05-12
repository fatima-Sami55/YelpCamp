const express = require('express');
const router = express.Router();
const wrapError = require('../helpers/errorWraper');
const controllers = require('../controllers/camp');
const { storage } = require('../cloudinary/app')
const multer = require('multer');
const upload = multer({ storage });
const { isLoggedIn, validateCamp, isAuthor, normalizeCampgroundBody } = require('../middle')



router.get('/', wrapError(controllers.index))

router.post('/', isLoggedIn, upload.array('image'), normalizeCampgroundBody, validateCamp, wrapError(controllers.createCamp))

router.get('/:id', wrapError(controllers.showCamp))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), normalizeCampgroundBody, validateCamp, wrapError(controllers.Update));


router.delete('/:id', isLoggedIn, isAuthor, wrapError(controllers.delete))


module.exports = router;
