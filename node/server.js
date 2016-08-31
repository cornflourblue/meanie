require('rootpath')();
var express = require('express');
var ejs = require('ejs');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('config.json');

// enable ejs templates to have .html extension
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// set default views folder
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// redirect to the install page if first time running
app.use(function (req, res, next) {
    if (!config.installed && req.path !== '/install') {
        return res.redirect('/install');
    }

    next();
});

// api routes
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/posts', require('./controllers/api/posts.controller'));

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

// start server
var server = app.listen(3000, function () {
    console.log('Server listening on port ' + server.address().port);
});