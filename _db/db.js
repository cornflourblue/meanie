var config = require('config.json');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = {
    Site: require('./site.model'),
    User: require('./user.model'),
    Post: require('./post.model'),
    Page: require('./page.model'),
    Redirect: require('./redirect.model')
};