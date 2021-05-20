const mongoose = require('mongoose');
const model = require('../model/yelp')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected!')
    }).catch(err => {
        console.log('Something went wrong')
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const allDelete = async () => {
    await model.deleteMany({});
    for (let i = 0; i <= 200; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 20;
        const newCamp = new model({
            author: '60a0f0a1fe61eb1f188f7ca2',
            location: `${cities[rand1000].city} - ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sunt cum, amet nam odit optio harum eveniet saepe non, eligendi modi porro ducimus, animi iure quidem voluptate ipsum. Quae, voluptates.',
            price: price,
            geometry: {
                  type: 'Point' ,
                  coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude,
                ]
                },
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'


                },
                {


                    url: 'https://res.cloudinary.com/dvm6ebpga/image/upload/v1621255657/YelpCamp/enppbucu1rlholo2v4lq.jpg',
                    filename: 'YelpCamp/fbc5icxojuzzpv7dm8yb'
                }
            ],
        })
        await newCamp.save();
    }
}

allDelete().then(() => mongoose.connection.close());