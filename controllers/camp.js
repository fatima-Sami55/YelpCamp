const model = require('../model/yelp')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary/app')

module.exports.index = async (req, res) => {
    const Camp = await model.find({});
    res.render('camp/index', { Camp })
}

module.exports.newForm = (req, res) => {
    res.render('camp/new')
}

module.exports.createCamp = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new model(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f =>({url:f.path, filename:f.filename}));
    camp.author = req.user._id;
    await camp.save()
    console.log(camp)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campGround/${camp._id}`)
}

module.exports.showCamp = async (req, res) => {
    const camp = await model.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campGround')
    }
    res.render('camp/show', { camp })
}

module.exports.edit = async (req, res) => {
    const {id} = req.params
    const camp = await model.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campGround')
    }
    res.render('camp/edit', { camp });
}

module.exports.Update = async (req, res) => {
    const {id} = req.params
    const camp = await model.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f =>({url:f.path, filename:f.filename}));
    camp.images.push(...imgs);
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campGround/${camp._id}`)
}

module.exports.delete = async (req, res) => {
    const {id} = req.params
    await model.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted the campground!')
    res.redirect('/campGround')
}

