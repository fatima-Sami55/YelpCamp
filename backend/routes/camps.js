const express = require('express');
const router = express.Router();
const wrapError = require('../helpers/errorWraper');
const controllers = require('../controllers/camp');
const { storage } = require('../cloudinary/app')
const multer = require('multer');
const upload = multer({ storage });
const { isLoggedIn, validateCamp, isAuthor } = require('../middle')



router.get('/', wrapError(controllers.index))

router.get('/new', isLoggedIn, controllers.newForm)

router.post('/', isLoggedIn, upload.array('image'), validateCamp, wrapError(controllers.createCamp))

router.get('/:id', wrapError(controllers.showCamp))


router.get('/:id/edit', isLoggedIn, isAuthor, wrapError(controllers.edit))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCamp, wrapError(controllers.Update));


router.delete('/:id', isLoggedIn, isAuthor, wrapError(controllers.delete))


module.exports = router;