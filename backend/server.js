const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
const PORT = 4000;
// const userRoutes = express.Router();

// let User = require('./models/user');

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));

// Connection to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established succesfully.");
})

// API endpoints
app.use('/api/users', require('./routes/api/users'))
app.use('/api/items', require('./routes/api/items'))
app.use('/api/auth', require('./routes/api/auth'))


// app.use('/', userRoutes);

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
});
