/* 
1) browser sends creds
2) server sends an AES encrypted session, which has the username
3) browser stores it in the local storage
4) the session has a creation date so it can be expired after some time
5) the encrypted session sent with each request **with the app not the browser**

How I see this: (might be wrong)
- CSRF can't use it
- with JWT, CSRF sends the refresh token each time and get the server to respond, while this won't get a response since no session is sent with the request
- also it's stateless, so scales horizontally easily

    ? Is this secure?**
    ? How is this compared to JWT?
*/

// TODO: add inputs validation in contronllers
// TODO: rate limiter
// TODO: error handler
// TODO: pm2 cluster

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

// vars
require('dotenv').config();
const PORT = process.env.APIPORT ?? 1000;
const app = express();

// Cross Origin Resource Sharing
const whitelist = ['http://127.0.0.1:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

// const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
// app.use(session({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   cookie: {
//     secure: true,
//     httpOnly: true,
//     domain: 'example.com',
//     path: 'foo/bar',
//     expires: expiryDate
//   }
// }))

app.use(cors(corsOptions));
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}
app.use(compression({filter: shouldCompress}));

// ROUTES
app.use('/api', require('./api/v1/router/').router);

// custom 404
app.use((req, res) => {
    res.status(404).send('Nop, I found nothing!');
});

// custom error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something went bad!');
});

// lunch server;
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
