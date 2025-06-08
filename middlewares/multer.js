const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
    destination :async function (req,file,cb){
        const user_id = req.user?.seller_id;
        const sku = req.body.sku_id;
        console.log(req.files);
        const dir = path.join(__dirname,`../uploads/products/${user_id}/${sku}`);
        fs.mkdirSync(dir, { recursive: true }); 
        cb(null, dir);
    },
    filename : function (req,file,cb){
        const name = file.originalname;
        const sku = req.body.sku_id;
        console.log("File uploaded");
        cb(null,`${sku}-${name}`);
    }
})

const upload = multer({storage});

module.exports = {upload};