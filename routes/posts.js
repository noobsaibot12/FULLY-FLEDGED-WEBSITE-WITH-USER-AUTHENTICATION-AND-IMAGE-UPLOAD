const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageText : {
        type :String
    },
    title : {
        type :String
    },
    image: {
        type :String
    },
    userid: {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User' 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model('Post',postSchema);