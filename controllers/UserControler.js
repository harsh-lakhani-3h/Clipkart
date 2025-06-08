const Buyer = require("../models/user");
const salesorders = require("../models/salesorders");
const { getid, hash, checkpassword, gettoken, getcookieconfig, groupBy } = require("../utilities");
const product = require("../models/product");


async function RegisterBuyer(req, res) {
    try {
        const { user_name, mo_no, address, password } = req.body;
        const requ = { user_name, mo_no, address, password };
        for (const [k, v] of Object.entries(requ)) {
            if (!v) {
                return res.status(400).send(`Msg : Invalid request ${k} is missing`);
            }
        }
        const user_id = getid();
        const NewUser = new Buyer({
            user_name,
            mo_no,
            address,
            user_id,
            password: await hash(password),
        })
        console.log("Hello user");
        await NewUser.save();
        const payload = {
            user_name,
            user_id
        }
        const token = await gettoken(payload);
        res.cookie("token", token, getcookieconfig()).send({ Msg: "Nou are Authorised for an hour" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send("Error : This User already exists");
        } else {
            return res.status(500).send({ Error: 'surver error' });
        }
    }
}

async function LoginBuyer(req, res) {
    const { mo_no, password } = req.body;

    try {
        const user = await Buyer.findOne({ mo_no: `${mo_no}` });
        const payload = {
            user_name: user.user_name,
            user_id: user.user_id
        }
        const token = await gettoken(payload);
        if (await checkpassword(password, user.password)) {
            return res.status(200).cookie("token", token, getcookieconfig()).send("Msg : you are Authorised Buyer");
        } else {
            return res.status(400).send("Msg : Wrong password");
        }
    } catch (er) {
        return res.status(400).send("MSG : No User found")
    }
}

async function NewOrder(req, res) {
    const gotorders = req.body.order;
    gotorders.sort((a, b) =>
        a.seller_id - b.seller_id || (a.sku_id.localeCompare(b.sku_id))
    );
    console.log(gotorders);
    const filter = gotorders.map(({ quantity, ...rest }) => rest);
    // console.log(filter);
    const dbResult = await product.find({ $or: filter }, { seller_id: 1, sku_id: 1, stock: 1, price: 1, _id: 0 }).lean();

    let bill_total = 0, hasError;
    const stockAfterOrder = [];
    if (gotorders.length === dbResult.length) {
        dbResult.sort((a, b) =>
            a.seller_id - b.seller_id || (a.sku_id.localeCompare(b.sku_id))
        );
        console.log(dbResult);
        const finalMerge = dbResult.map((order, index) => {
            if (gotorders[index].quantity > order.stock) {
                hasError = true;
                return null;
            }
            const finalMerge = {
                ...order,
                total: gotorders[index].quantity * order.price,
                ...gotorders[index],
            }
            const stock = {
                seller_id: gotorders[index].seller_id,
                sku_id: gotorders[index].sku_id,
                stock: order.stock - gotorders[index].quantity
            }
            stockAfterOrder.push(stock);
            bill_total += finalMerge.total;
            return finalMerge
        });
        if (hasError) {
            return res.send({ Msg: "Your requested quentity is not available" })
        }
        console.log(finalMerge);

        const grouped = groupBy(finalMerge, "seller_id");

        console.log(grouped);

        const order = Object.entries(grouped).map(([seller_id, value], index) => {
            console.log("hey ", value);

            const seller_bill_total = value.reduce((sum, item) => sum + item.total, 0);

            const order = {
                seller_id: parseInt(seller_id),
                user_id: req.user.user_id,
                bill_total: seller_bill_total, 
                items: value.map(({ seller_id, stock, ...rest }) => ({ ...rest })),
                order_id: 'CF-' + Math.random().toString(36).substring(2, 9)
            }
            return order;
        })
        console.log(order);
        await salesorders.insertMany(order);
    } else {
        return res.status(400).send({ Msg: "Your requested data is not consistent. Plese recheck request" })
    }

    console.log(stockAfterOrder);
    const bulkUpdate = stockAfterOrder.map((item) => ({
        updateOne: {
            filter: {
                seller_id: item.seller_id,
                sku_id: item.sku_id
            },
            update: {
                $set: { stock: item.stock }
            }
        }
    }))
    await product.bulkWrite(bulkUpdate);
    return res.send("Hii");
}

async function CancelOrder(req,res) {
    const user_id = req.user.user_id;
    const cancel = req.body.cancel;
    console.log(user_id,cancel);
    if(cancel){
        await salesorders.updateMany(
            {user_id,
                order_id : {$in : cancel}
            },
            {
                    $set : {order_status:"canceled"}
                }
            );
            console.log("Order Canceled Successfully");
            return res.send(req.body.cancel);
        }else{
            return res.send({Msg : "No orders to cancel"});
        }
    }
    
async function ShowAllOrders(req,res) {
    const user_id = req.user.user_id;
    const orders = await salesorders.find({user_id});
    res.send(orders);
}

module.exports = { RegisterBuyer, LoginBuyer, NewOrder,CancelOrder ,ShowAllOrders}