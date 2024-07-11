require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbConnect = require('./db');
const userRoute = require('./userRoutes');
const orgRoute = require('./orgRoute');

const app = express();

// Connect to the database
dbConnect();

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 1000 * 60 * 3,
            secure: false,
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_AUTH,
        }),
    })
);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', userRoute);
app.use('/api/organisations', orgRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server listening on port:', PORT);
});


module.exports = { app }