const model = require('../model/yelp')
const review = require('../model/review');


module.exports.CreateR = async (req, res) => {
    const camp = await (await model.findById(req.params.id));
    const rev = new review(req.body.review);
    rev.author = req.user._id;
    camp.reviews.push(rev);
    await rev.save();
    await camp.save();
    res.json({ review: rev, message: 'Added a new review!' })
}

module.exports.deleteR = async (req, res) => {
    const { id, reviewId } = req.params;
    await model.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.json({ message: 'Successfully deleted a review!' })
}