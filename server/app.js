const express = require('express');
const app = express();

const dbConfig = require('./database/config');

const router = require('./helpers/router');

const PORT = process.env.PORT || 8081;
const HOST = process.env.IP || 'localhost';

app.use(express.json());

const db = require('./database/db');
const neoConfig = require('./database/config');
db.connect(neoConfig.dev.url, neoConfig.dev.username, neoConfig.dev.password);

router(app);

app.listen(PORT, HOST, (err) => {
    if (err) {
        console.err(err);
    }

    console.log(`Server running on ${HOST}:${PORT}...`);
});