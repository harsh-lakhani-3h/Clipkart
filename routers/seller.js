const express = require("express");
const {ListNewProduct,ShowMyProducts,ModifyProduct,ShowAllOrders,ShowAllSales,ProcessOrders} = require("../controllers/SellerControler");
const {upload} = require("../middlewares/multer")

const router = express.Router();

router.post("/list-product",upload.array("product",3),ListNewProduct);

router.get("/products",ShowMyProducts);

router.post("/modify-products",ModifyProduct);

router.get("/orders",ShowAllOrders);

router.post("/process-orders",ProcessOrders)

router.get("/sales",ShowAllSales);

module.exports = router;