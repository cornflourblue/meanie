var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('../helpers/db');
var User = db.User;

module.exports = AuthService;

function AuthService() {
    Object.assign(this, {
        authenticate
    });
}

async function authenticate(username, password) {
    var user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.hash)) {
        // authentication successful
        var token = jwt.sign({ sub: user._id }, config.secret);
        return token;
    } else {
        // authentication failed
        return null;
    }
}
