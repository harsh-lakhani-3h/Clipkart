const {checktoken} = require("../utilities");

function Authenticate(req, res, next){
    const token = req.cookies.token;
    console.log(token);
    checktoken(token).then((resolved)=>{req.user = resolved;console.log("Verified"); next()})
    .catch(()=>{res.status(400).send("Forbidden Error")});
}


module.exports = {Authenticate};