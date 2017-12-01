require('rootpath')();
var express = require('express');
var ejs = require('ejs');
var app = express();
var compression = require('compression');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var config = require('config.json');
var errorHandler = require('helpers/error-handler');

// enable ejs templates to have .html extension
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// set default views folder
app.set('views', __dirname + '/../client');

// enable gzip compression
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: config.secret,
    store: new MongoStore({ url: config.connectionString }),
    resave: false,
    saveUninitialized: true
}));

// redirect to the install page if first time running
app.use(function (req, res, next) {
    if (!config.installed && req.path !== '/install') {
        return res.redirect('/install');
    }

    next();
});

app.use('/api', require('./api/api.controller'));
app.use('/admin', require('admin/admin.controller'));
app.use('/install', require('install/install.controller'));
app.use('/login', require('login/login.controller'));

// make current user available to angular app
app.get('/current-user', function (req, res) {
    res.send(req.session.user);
});

// blog front end
// TODO: front end will be served from subdomain
// app.use('/', require('./controllers/blog.controller'));

// global error handler
app.use(errorHandler);

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});