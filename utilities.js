const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const secret_for_tokens = process.env.secret_for_tokens || "HarshLakhani", token_expires_in = { expiresIn: '1h' };
const bcryptRounds = process.env.bcryptRounds ? parseInt(process.env.bcryptRounds) : 10;

function removespace(x){
    return x.replace(" ","");
}

function getcookieconfig( overrides = {}){
    return {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'strict',
        maxAge : 1000 * 60 * 60 ,
        ...overrides
    }
}

function getid(x = 6) {
    generator = customAlphabet('123456789', x);
    return generator();
}

async function hash(password, rounds = bcryptRounds) {
    return bcrypt.hash(password, rounds);
}

async function checkpassword(password, hash) {
    return new Promise((resolve)=>{
        resolve(bcrypt.compare(password, hash));
    });
}

function gettoken(paylod, secret_key = secret_for_tokens, exipre = token_expires_in) {
    return new Promise((resolve)=>{
        resolve(jwt.sign(paylod, secret_key, exipre));
    })
}

function checktoken(token, secret = secret_for_tokens) {
    return new Promise((resolve,reject)=>{
        jwt.verify(token,secret,(err,decode)=>{
            if(err) return reject("Invalid Token");
            return resolve(decode);
        })
    })
}

function groupBy(array,property){
    const grouped = {};
    for (const element of array) {
        const key = element[property];
        if(!grouped[key]){
            grouped[key]=[];
        }
        grouped[key].push(element);
    }
    return grouped
}

module.exports = { getid, hash, checkpassword, gettoken, checktoken, getcookieconfig ,removespace,groupBy}