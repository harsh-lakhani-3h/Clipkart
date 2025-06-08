const mongo = require("mongoose");

const salesorderschema = mongo.Schema({
    order_id: { type: String },
    user_id: { type: Number },
    seller_id: { type: Number },
    items: [
        {
            sku_id: { type: String, required: true },
            quantity: { type: Number, required: true },
            price : {type : Number, required : true},
            total: { type: Number },
            rating: { type: Number ,default:0}
        }
    ],
    order_status: {
        type: String,
        enum: ['pending', 'rejected','canceled', 'processed', 'dispatched', 'delivered'],
        default: 'pending'
    },
    bill_total: { type: Number }
}, { timestamps: true })

module.exports = mongo.model('sales', salesorderschema);