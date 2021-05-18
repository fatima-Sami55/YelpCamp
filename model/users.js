const mongoose = require('mongoose');
const {Schema} = mongoose;

const localMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(localMongoose);

module.exports =  mongoose.model('User', userSchema);
