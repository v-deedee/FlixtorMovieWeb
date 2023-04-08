const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Sequelize = require('sequelize');
const config = require('./src/config/server');

const app = express();
const port = config.port;

const routes = require('./src/routes/index');

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views', 'pages'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static file 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// router
routes(app);


// 
app.get('/', function(req, res){
    res.send("Hello World");
})

app.listen(port, function(error){
    if (error) {
        console.log("Something went wrong");
    }
    console.log("server is running port:  " + port);
})


// Kết nối database
const sequelize = new Sequelize(
    config.db.database,
    config.db.username, 
    config.db.password, 
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


