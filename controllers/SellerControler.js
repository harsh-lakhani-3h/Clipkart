const SellerModel = require("../models/seller");
const product = require("../models/product");
const salesOrder = require("../models/salesorders");
const { getid, hash, checkpassword, gettoken, getcookieconfig } = require("../utilities");

async function RegNewSeller(req, res) {
    try {
        const { seller_name, mo_no, gst_no, password } = req.body;
        const requ = { seller_name, mo_no, gst_no, password };
        for (const [k, v] of Object.entries(requ)) {
            if (!v) {
                return res.status(400).send(`Msg : Invalid request ${k} is missing`);
            }
        }
        const NewSeller = new SellerModel({
            seller_name,
            mo_no,
            gst_no,
            seller_id: getid(6),
            password: await hash(password),
        })
        await NewSeller.save();
        const payload = {
            seller_name: seller.seller_name,
            seller_id: seller.seller_id,
            gst_id: seller.gst_id
        }
        const token = await gettoken(payload);
        res.cookie("token", token, getcookieconfig()).send({ Msg: "User Registerd Successfully" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send("Error : This User already exists");
        } else {
            return res.status(500).send({ Error: 'surver error' });
        }
    }
}

async function LoginSeller(req, res) {
    const { mo_no, password } = req.body;

    try {
        const seller = await SellerModel.findOne({ mo_no: `${mo_no}` });
        if (await checkpassword(password, seller.password)) {
            const payload = {
                seller_name: seller.seller_name,
                seller_id: seller.seller_id,
                gst_id: seller.gst_id
            }
            const token = await gettoken(payload);
            return res.status(200).cookie("token", token, getcookieconfig()).send("Msg : You are now Authorised User");
        } else {
            return res.status(400).send("Msg : Wrong password");
        }
    } catch (er) {
        return res.status(400).send("MSG : No User found")
    }
}

async function ListNewProduct(req, res) {
    console.log("Hii inside");
    try {
        const { sku_id, product_name, description, price, stock } = req.body;
        const { seller_id, seller_name } = req.user;
        console.log(req.files);
        const img = req.files.map(x => ({ img: x.path.split("ClipKart")[1].replace(/\\/g, "/") }));
        console.log(img);
        const newpeoduct = new product({
            seller_id, seller_name, sku_id, product_name, description, price, stock, image: img
        })

        await newpeoduct.save();
        res.status(200).send("Msg : Files uploaded successfully");
    } catch (err) {
        res.status(400).send("Msg : Record Already exists");
    }
}

async function ShowMyProducts(req, res) {
    const products = await product.find({ seller_id: req.user.seller_id });
    console.log(product);
    res.status(200).send({ YourProducts: products });
}

async function ModifyProduct(req, res) {
    const { sku_id, product_name, description, price, stock, activation_status } = req.body;
    if (!sku_id) {
        res.ststus(400).send("sku_id is missing in req");
    }
    const Modified_product = {
        product_name: product_name,
        description: description,
        price: price,
        stock: stock,
        activation_status: activation_status,
    }
    try {
        await products.findOneAndUpdate(
            { seller_id: req.user.seller_id, sku_id: sku_id },
            { $set: Modified_product });
        res.status(200).send({ "Msg": `${product_name} updated successfully` });
    } catch (er) {
        res.status(400).send("Product dont exists");
    }
}

async function ShowAllOrders(req, res) {
    seller_id = req.user.seller_id;
    const pandingOrders = await salesOrder.find({
        seller_id,
        order_status: "pending"
    })
    if (pandingOrders.length === 0) {
        return res.send({ Msg: "No orders are panding" });
    } else {
        console.log(pandingOrders);
        return res.send(pandingOrders);
    }
}

async function ProcessOrders(req, res) {
    seller_id = req.user.seller_id;
    const process = req.body.orders;
    if(process){
        await salesOrder.updateMany(
            {seller_id,
                order_id : {$in : process}
            },
            {
                $set : {order_status:"delivered"}
            }
        );
        console.log("Updeted Successfully");
        return res.send(req.body.orders);
    }else{
        return res.send({Msg : "No orders to process"});
    }
}

async function ShowAllSales(req, res) {
    seller_id = req.user.seller_id;
    const fulfilledOrders = await salesOrder.find({
        seller_id,
        order_status: "delivered"
    })
    if (fulfilledOrders.length === 0) {
        return res.send({ Msg: "No sold products" });
    } else {
        console.log(fulfilledOrders);
        return res.send(fulfilledOrders);
    }
}


module.exports = { RegNewSeller, LoginSeller, ListNewProduct, ShowMyProducts, ModifyProduct, ShowAllOrders, ShowAllSales, ProcessOrders }