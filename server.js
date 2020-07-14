require('rootpath')();
require('dotenv').config()
var express = require('express');
var ejs = require('ejs');
var app = express();
var compression = require('compression');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

var userService = require('services/user.service');

// enable ejs templates to have .html extension
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// set default views folder
console.log("view dir:" + __dirname + '/client');
app.set('views', __dirname + '/client');

// enable gzip compression
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log("process.env.MONGODB_URI: " + process.env.MONGODB_URI);
console.log("process.env.CONNECTION_STRING: " + process.env.CONNECTION_STRING);
app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({ url: process.env.MONGODB_URI || process.env.CONNECTION_STRING }),
    resave: false,
    saveUninitialized: true
}));

// redirect to the install page if first time running
app.use(function (req, res, next) {
    //don't redirect if we're already at install page
    if (req.path === '/install') {
        next();
    } else {
        userService.getAll().then(function (users) {
            if (!users || users.length == 0) {
                return res.redirect('/install');
            } else {
                next();
            }
        });
    }
});

// api routes
app.use('/api/contact', require('./controllers/api/contact.controller'));
app.use('/api/pages', require('./controllers/api/pages.controller'));
app.use('/api/posts', require('./controllers/api/posts.controller'));
app.use('/api/redirects', require('./controllers/api/redirects.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make JWT token available to angular app
app.get('/token', function (req, res) { 
    res.send(req.session.token);
});

// standalone pages
app.use('/install', require('./controllers/install.controller'));
app.use('/login', require('./controllers/login.controller'));

// admin section
app.use('/admin', require('./controllers/admin.controller'));

// blog front end
app.use('/', require('./controllers/blog.controller'));

// serve vendor assets from '/_dist'
app.use('/_dist/bootstrap',express.static(__dirname+'/node_modules/bootstrap'));
app.use('/_dist/ckeditor',express.static(__dirname+'/node_modules/ckeditor'));
app.use('/_dist/jquery-ui/themes',express.static(__dirname+'/node_modules/jquery-ui/themes'));
app.use('/_dist/jquery-ui',express.static(__dirname+'/node_modules/jquery-ui-dist'));
app.use('/_dist', express.static('./client/_dist'));

// start server
var port = process.env.PORT;
port = port || (process.env.NODE_ENV === 'production' ? 80 : 3000);
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
