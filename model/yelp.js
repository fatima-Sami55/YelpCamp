const mongoose = require('mongoose');
const review = require('./review')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dvm6ebpga/image/upload/v1621245177/YelpCamp/pvkhkzuws2g8hnp62anu.jpg

const ImageSchema = new Schema({

       url: String,
       filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
       return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };

const yelpSchema = new Schema({
       title: String,
       description: String,
       geometry: {
              type: {
                     type: String,
                     enum: ['Point'],
                     required: true
              },
              coordinates: {
                     type: [Number],
                     required: true
              }
       },
       price: Number,
       location: String,
       images: [ImageSchema],
       author: {
              type: Schema.Types.ObjectId,
              ref: 'User'
       },
       reviews: [
              {
                     type: Schema.Types.ObjectId,
                     ref: 'Review'
              }
       ]
},opts);

yelpSchema.virtual('properties.popUpMarkup').get(function () {
       return `
       <strong><a href='/campGround/${this._id}'>${this.title}</a></strong>
       <p>${this.description.substring(0,25)}</p>`;
})

yelpSchema.post('findOneAndDelete', async function (lastDeleted) {
       if (lastDeleted) {
              await review.deleteMany({
                     _id: {
                            $in: lastDeleted.reviews
                     }
              })
       }
})

module.exports = mongoose.model('Camp', yelpSchema);