var config = require('config.json');
var fs = require("fs");
var bcrypt = require('bcryptjs');
var db = require('_db/db');

module.exports = {
    install
};

async function install(userParam, hostName) {
    // create system admin user
    var user = new db.User(userParam);
    user.isSystemAdmin = true;

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
    
    // create default site
    var site = new db.Site({
        name: 'Default Site',
        domains: [hostName],
        createdBy: user._id,
        createdDate: Date.now()
    });

    // save site
    await site.save();
    
    // save installed flag in config file
    config.installed = true;
    fs.writeFileSync('./config.json', JSON.stringify(config));
}
