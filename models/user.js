const mongo = require('mongoose');

const userschema = mongo.Schema({
    user_id: { type: Number },
    user_name: { type: String },
    address: { type: String },
    mo_no: { type: Number, required: true, unique: true },
    password: { type: String }
})

module.exports = mongo.model('users', userschema);