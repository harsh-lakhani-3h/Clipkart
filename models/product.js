const mongo = require("mongoose");

const productschema = mongo.Schema({
    seller_id: { type: Number, required: true },
    seller_name: { type: String, required: true },
    image: {
        type: [{ img: { type: String, required: true } }],
    },
    sku_id: { type: String, required: true, unique: true },
    product_name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    activation_status : {type : Boolean , require:true,default:true},
    rating: { type: Number },
    unit_sold: { type: Number }
})
module.exports = mongo.model('products', productschema);