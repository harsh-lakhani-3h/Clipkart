const mongoose = require('mongoose');
const {hash} = require("../utilities");
const Seller = require('../models/product'); // Your Seller schema model
const sellers = require('./products.json'); // Or paste the array directly

mongoose.connect('mongodb://127.0.0.1:27017/clipkart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connectsd"));

async function insertSellers() {
    try {
        // const hashedSellers = await Promise.all(
        //     sellers.map(async (seller) => {
        //         const hashedPassword = await hash(seller.password);
        //         return { ...seller, password: hashedPassword };
        //     })
        // );

        await Seller.insertMany(sellers);
        console.log('Sellers inserted successfully!');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error inserting sellers:', err);
    }
}

insertSellers();
