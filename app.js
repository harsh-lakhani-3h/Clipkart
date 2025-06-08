require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const seller = require("./routers/seller");
const buyer = require("./routers/user")
const { RegNewSeller, LoginSeller } = require("./controllers/SellerControler");
const { RegisterBuyer, LoginBuyer } = require("./controllers/UserControler");
const cookieParser = require("cookie-parser");
const { Authenticate } = require("./middlewares/jwt");
const products = require("./models/product");
const path = require("path");


const cnnstr = process.env.CNN_URI || "mongodb://127.0.0.1:27017/clipkart";
const PORT = process.env.PORT || 8000;

mongoose.connect(cnnstr).then(() => { console.log("Connected To DB") }).catch(() => { console.log(`Error in DB connection}`) });



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


app.get("/", async (req, res) => {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const allProducts = await products.find({ activation_status: true }).skip(skip).limit(limit);
    // console.log(allProducts);
    res.json(allProducts);
})




app.use("/seller/register", RegNewSeller);
app.use("/seller/login", LoginSeller);

app.use("/register", RegisterBuyer);
app.use("/login", LoginBuyer);

app.use("/seller", Authenticate, seller);

app.use(Authenticate,buyer);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(PORT, () => { console.log(`App started on port ${PORT}`) });

