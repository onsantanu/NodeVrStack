var path = require('path');

const local = false;

//for mode of execution
const EXECUTION_MODE = "stag";

//get root directoty of the location where source code is uploaded
const BASEPATH = path.resolve(__dirname, '..');

//configure enviroment file so source code can be executed from any location
require('dotenv').config({path: BASEPATH + '/src/.env'});

//url of the server
const URL = "http://localhost:8091/";

const controllerPath = BASEPATH + '/src/app/';
//location where files will be stored
const FILEPATH = BASEPATH + '/public/uploadedFiles/';
const FILEOPPATH = BASEPATH + '/public/';

//defining en variables if env variable is not accessable
//LOCAL
const MYSQL_HOST = 'localhost';
const MYSQL_USER = 'root' ;
const MYSQL_PASSWORD =  'password';
const MYSQL_DB = 'nodevrstack';


//token validity in seconds
const TOKEN_VALIDITY = 3000;
//JWT details
const JWTSECRET = "Your Secret Key";
const JWTSECRETDECRYPT = "Your Secret Decrypt Key";
const JWT_ALGO = 'HS256';
const PAYLOAD_ENC_DEC = "4f776e65723a73616e74616e75446174653a3330303632303233"; // To encrypt or decrypt payload
//server port where application will accept request
const PORT = 8091;

//mysql config for
const MYSQL_CONFIG = {
    connectionLimit: 25,
    host: process.env.MYSQL_HOST || MYSQL_HOST,
    user: process.env.MYSQL_USER || MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || MYSQL_DB,
    multipleStatements: true
};

//Redis config 
// const REDIS_CONFIG = {
//     host: process.env.REDIS_HOST || REDIS_HOST,
//     password: process.env.REDIS_PASSWORD || REDIS_PASSWORD,
//     port: process.env.REDIS_PORT || REDIS_PORT
// };

// public routes that don't require authentication
const omitTokenAPiPath = [
    '/api/hc',
];

// public routes that don't require request decryption
const omitDecryptPayload = [
];

// public routes that don't require response encryption
const omitEncryptResponse = [
];


//salt rounds for generate salt and match/create encrypted password
const SALTROUND = 10;

GOOGLE_API_KEY = 'AIlaskdfjlasfjwerfjosfoisdjfsidij';

SENDER = 'NodeVrStack';
SMTP_USER = 'admin@mail.com';
SMTP_PWD = 'admin';
SMTP_HOST = 'smtp.gmail.com';
SMTP_PORT = 587;



module.exports = {
    controllerPath: controllerPath,
    MYSQL_CONFIG: MYSQL_CONFIG,
    FILEPATH: FILEPATH,
    URL: URL,
    MODE: "dev",
    MYSQL_HOST: MYSQL_HOST,
    MYSQL_USER: MYSQL_USER,
    MYSQL_PASSWORD: MYSQL_PASSWORD,
    MYSQL_DB: MYSQL_DB,
    TOKEN_VALIDITY: TOKEN_VALIDITY,
    JWTSECRET: JWTSECRET,
    JWT_ALGO: JWT_ALGO,
    JWTSECRETDECRYPT: JWTSECRETDECRYPT,
    PORT: PORT,
    omitTokenAPiPath: omitTokenAPiPath,
    EXECUTION_MODE: EXECUTION_MODE,
    BASEPATH: BASEPATH,
    SALTROUND: SALTROUND,
    FILEOPPATH: FILEOPPATH,
    GOOGLE_API_KEY: GOOGLE_API_KEY,
    SENDER: SENDER,
    SMTP_USER: SMTP_USER,
    SMTP_PWD: SMTP_PWD,
    SMTP_HOST: SMTP_HOST,
    SMTP_PORT: SMTP_PORT,
    PAYLOAD_ENC_DEC: PAYLOAD_ENC_DEC,
    omitDecryptPayload: omitDecryptPayload,
    omitEncryptResponse: omitEncryptResponse,
};
