var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('../helpers/db');

module.exports = AuthService;

function AuthService() {
    Object.assign(this, {
        authenticate
    });
}

async function authenticate(username, password) {
    var user = await db.User.findOne({ username }).populate('sites', 'name');

    if (user && bcrypt.compareSync(password, user.hash)) {
        // authentication successful
        var token = jwt.sign({ sub: user._id }, config.secret);

        if (user.isSystemAdmin) {
            // system admins have access to all sites
            user.sites = await db.Site.find();
        }

        return {
            username,
            token,
            isSystemAdmin: user.isSystemAdmin,
            sites: user.sites,
        };
    } else {
        // authentication failed
        return null;
    }
}
