const jwtToken = require('jsonwebtoken');
const config = require('../config');
var CryptoJS = require("crypto-js");

//create jwt token
let GetWebToken = async (data) => {
    data.reqtime = Date.now();
    return jwtToken.sign({data}, process.env.JWTSECRET || config.JWTSECRET, {algorithm: process.env.JWT_ALGO || config.JWT_ALGO})
};

//extract data from jwt token
let extractWebToken = async (data) => {
    // console.log(data)
    try {
        return jwtToken.verify(data, process.env.JWTSECRET || config.JWTSECRET, {algorithm: process.env.JWT_ALGO || config.JWT_ALGO})
    } catch (err) {
        console.log("JWT EXTRACT ERROR : ", err);
        return {}
    }
}


let createJWTToken = async (data) => {
    let secret = data.secret ? data.secret : config.JWTSECRET;
    delete data.secret;
    data.reqtime = Date.now();
    return jwtToken.sign(data, secret, {algorithm: process.env.JWT_ALGO || config.JWT_ALGO, expiresIn: '4h'})
};

let extractJWTToken = async (data) => {
    let secret = data.secret ? data.secret : config.JWTSECRET;
    delete data.secret;
    try {
        return jwtToken.verify(data.payload, secret, {algorithm: process.env.JWT_ALGO || config.JWT_ALGO})
    } catch (err) {
        console.log("JWT EXTRACT ERROR : ", err);
        return {}
    }
};

let createEncrypt = async (data) => {
    var ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(data.payload), data.encryptSecret).toString();
    return ciphertext;
}

let decryptPayload = async (data) => {
    var bytes = await CryptoJS.AES.decrypt(data, process.env.CRYPTO_DECRYPT || config.PAYLOAD_ENC_DEC);
    // console.log(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)))
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

let encryptPayload = async (data) => {
    return await CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_ENCRYPT || config.PAYLOAD_ENC_DEC).toString();
};

let authenticateToken = async (req, res, next) => {
    // console.log(req.url, req.method, req.body, req.headers)
    if (!config.omitTokenAPiPath.includes(req.url) && req.url.indexOf('/uploadedFiles') === -1) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.status(401).json(await encryptPayload({
                success: false,
                status: 401,
                message: "Token missing",
                response: ''
            }));
            const data = await extractJWTToken({payload: token});
            if (Object.keys(req.body).length === 0) {
                next();
            } else if (req.method === 'POST' && data.userid === req.body.userid) {
                next();
            } else if (req.method === 'GET') {
                next();
            } else {
                return res.status(498).json(await encryptPayload({
                    success: false,
                    status: 498,
                    message: "Invalid Token",
                    response: ''
                }))
            }
        } catch (e) {
            return res.status(498).json(await encryptPayload({success: false, status: 498, message: "Invalid Token", response: ''}))
        }
    } else {
        next();
    }
}

let decryptRequest = async (req, res, next) => {
    if (!config.omitDecryptPayload.includes(req.url) && req.url.indexOf('/uploadedFiles') === -1) {
        try {
            if (Object.keys(req.body).length === 0) {
                next();
            } else if (req.method === 'POST') {
                try {
                    req.body = await decryptPayload(req.body.payload);
                } catch (e) {
                    return res.status(400).json(await encryptPayload({
                        success: false,
                        status: 400,
                        message: "Invalid request",
                        response: null
                    }))
                }
                next();
            } else if (req.method === 'GET') {
                next();
            } else {
                return res.status(498).json(await encryptPayload({
                    success: false,
                    status: 498,
                    message: "Invalid Token",
                    response: null
                }))
            }
        } catch (e) {
            return res.status(400).json(await encryptPayload({
                success: false,
                status: 400,
                message: "Invalid request",
                response: null
            }))
        }

    } else {
        next();
    }
}

let encryptResponse = async (req, res, next) => {
    try {
        if (!config.omitEncryptResponse.includes(req.url)) {
            const oldSend = res.json;
            res.json = async (data) => {
                res.json = oldSend; // set function back to avoid the 'double-send'
                return res.json(await encryptPayload(data))
            };
        }
        next();
    } catch (e) {
        next()
    }
}


module.exports = {
    GetWebToken: GetWebToken,
    extractWebToken: extractWebToken,
    createJWTToken: createJWTToken,
    extractJWTToken: extractJWTToken,
    createEncrypt: createEncrypt,
    decryptPayload: decryptPayload,
    authenticateToken: authenticateToken,
    decryptRequest: decryptRequest,
    encryptResponse: encryptResponse
}
