const model = require('../model/yelp')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary/app')

async function getGeometry(location) {
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send()

    return geoData.body.features[0]?.geometry;
}

module.exports.index = async (req, res) => {
    const Camp = await model.find({});
    res.json({ campgrounds: Camp })
}

module.exports.createCamp = async (req, res) => {
    const geometry = await getGeometry(req.body.campground.location);
    if (!geometry) {
        return res.status(400).json({ error: 'Could not find that location' });
    }

    const camp = new model(req.body.campground);
    camp.geometry = geometry;
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

module.exports.Update = async (req, res) => {
    const {id} = req.params
    const camp = await model.findById(id);
    if (!camp) {
        return res.status(404).json({ error: 'Cannot find that campground!' });
    }

    camp.set(req.body.campground);

    if (req.body.campground.location) {
        const geometry = await getGeometry(req.body.campground.location);
        if (!geometry) {
            return res.status(400).json({ error: 'Could not find that location' });
        }
        camp.geometry = geometry;
    }

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

