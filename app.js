// copied over from WebDev Final Project Snake Game
//

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var MongoClient = require('mongodb').MongoClient;


//var index = require('./routes/index');
//var users = require('./routes/users');

//var app = express();
var app = require('express')();

var server = require('http').Server(app);
//var io = require('socket.io')(server);

var port = process.env.PORT || 3000;



//var game = require('./game/game')(io);


var index = require('./routes/gameinfo');
//var index = require('./routes/index');

var mongo_url = process.env.MONGO_URL;
// console.log('mongo_url = ' + mongo_url);


//var mongo_url = "mongodb://dbUser:456def@127.0.0.1:27017/invade?authSource=admin";

console.log('app.js    mongo_url = ' + mongo_url);

mongoose.Promise = global.Promise;
mongoose.connect(mongo_url, {useMongoClient: true})
    .then( () => { console.log('Connected to MongoDB');})
    .catch( (err) => { console.log('Error connecting',err);});



var store = new MongoDBStore( { uri : mongo_url, collection: 'sessions'}, function(err){
    if (err) {
        console.log('Error, can\'t connect to MongoDB to store sessions', err);
    }
});

server.listen(port, function(){
    console.log('listening on *:' + port);
});


app.use(session({
    secret: 'replace with long random string',
    resave: true,
    saveUninitialized: true,
    store: store
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());         // This creates an req.user variable for logged in users.
app.use(flash());

console.log('right before call to index');
app.use('/', index);

MongoClient.connect(mongo_url).then( (db) => {

    var users = db.collection('users');

    app.use('/', function(req, res, next) {
        req.users = users;
        next();
    });

    app.use('/update', function(req, res, next) {
        req.users = users;
        next();
    });

}).catch( (err) => {
    console.log('Error connecting to MongoDB', err);
    process.exit(-1);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app: app, server: server };
