const model = require('../model/yelp')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary/app')

module.exports.index = async (req, res) => {
    const Camp = await model.find({});
    res.json({ campgrounds: Camp })
}

module.exports.newForm = (req, res) => {
    res.json({})
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
    res.json({ campground: camp, message: 'Successfully made a new campground!' })
}

module.exports.showCamp = async (req, res) => {
    const camp = await model.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        return res.status(404).json({ error: 'Cannot find that campground!' })
    }
    res.json({ campground: camp })
}

module.exports.edit = async (req, res) => {
    const {id} = req.params
    const camp = await model.findById(id)
    if (!camp) {
        return res.status(404).json({ error: 'Cannot find that campground!' })
    }
    res.json({ campground: camp })
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
        
    res.json({ campground: camp, message: 'Successfully updated the campground!' })
}

module.exports.delete = async (req, res) => {
    const {id} = req.params
    await model.findByIdAndDelete(id)
    res.json({ message: 'Successfully deleted the campground!' })
}

