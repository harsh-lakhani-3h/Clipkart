const mongo = require("mongoose");

const sellerschema = mongo.Schema({
    seller_id: { type: Number },
    seller_name: { type: String },
    password: { type: String },
    mo_no: { type: Number, unique: true },
    gst_no: { type: String }
})

module.exports = mongo.model('sellers', sellerschema);