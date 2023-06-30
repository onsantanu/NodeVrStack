const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const config = require('./config');
const l = require('./utility/logger');
const http = require('http');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || config.PORT;
const app = express();
const dirname = __dirname.replace('/src', '');
const root = dirname + "/public";

// compress all responses
app.use(compression())

// set static path
app.use(express.static(path.resolve(config.FILEPATH)));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(helmet.frameguard({action: 'SAMEORIGIN'}));

// enabling CORS for all requests
app.use(cors());
app.use(express.static(root));
app.set('views', path.join(dirname, 'public'));
app.set('view engine', 'html');

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// To decrypt request payload
// app.use(token.decryptRequest);

// To validate authentication token
// app.use(token.authenticateToken);

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: (request, response) => {
        if (request.url.indexOf('generateFieldOTP') > -1) return 10;
        else return 200
    }, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(apiLimiter);

/*
* This method will find all the controller and initiate routes
*/
function getAllRoutingFiles(folderPath) {
    const routingFiles = [];

    function traverseFolder(currentPath) {
        const files = fs.readdirSync(currentPath);

        files.forEach((file) => {
            const filePath = path.join(currentPath, file);
            const fileStats = fs.statSync(filePath);

            if (fileStats.isDirectory()) {
                traverseFolder(filePath); // Recursive call for nested folders
            } else if (fileStats.isFile() && path.extname(file) === '.js' && file.indexOf('controller') > -1) {
                const routePath = filePath.replace(config.controllerPath, '').replace(file, '')
                app.use('/api/' + routePath , require(filePath));
            }
        });
    }

    traverseFolder(folderPath);
}
// To initiate API routing
getAllRoutingFiles(config.controllerPath);

// To encrypt response body
// app.use(token.encryptResponse);

const server = http.createServer(app);
server.listen(PORT, () => {
    l.logger.log('info', 'listening on port ' + PORT);
});
