const express = require("express");
const {NewOrder,CancelOrder,ShowAllOrders} = require("../controllers/UserControler");

const router = express.Router();

router.post("/order",NewOrder);

router.post("/cancle",CancelOrder);

router.get("/orders", ShowAllOrders);


module.exports = router;