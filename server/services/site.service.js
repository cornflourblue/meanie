var config = require('config.json');
var validateSubdomain = require('helpers/validate-subdomain');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

var Site = mongoose.model('Site', { subdomain: String })

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

async function getAll() {
    return await Site.find();
}

async function getById(_id) {
    return await Site.findById(_id);
}

async function create(siteParam) {
    // require('assert').strictEqual(1, 2);

    // validate
    var errors = [];
    if (!siteParam.subdomain) { errors.push('Subdomain is required'); } 
    else if (!validateSubdomain(siteParam.subdomain)) { errors.push('Subdomain is invalid'); }
    if (errors.length) return new Error(errors.join('\r\n'));
        
    // check if subdomain already taken
    var site = await Site.findOne({ subdomain: siteParam.subdomain });
    if (site) throw 'Subdomain "' + siteParam.subdomain + '" is already taken';

    // save
    var site = new Site(siteParam);
    await site.save();
}

async function update(_id, siteParam) {
    // validate
    var errors = [];
    if (!siteParam.subdomain) { errors.push('Subdomain is required'); } 
    else if (!validateSubdomain(siteParam.subdomain)) { errors.push('Subdomain is invalid'); }
    if (errors.length) throw errors.join('\r\n');
    
    // update
    await Site.findByIdAndUpdate(_id, { $set: siteParam });
}

async function _delete(_id) {
    await Site.findByIdAndRemove(_id);
}