var validateSubdomain = require('helpers/validate-subdomain');
var db = require('helpers/db');
var Site = db.Site;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Site.find();
}

async function getById(_id) {
    return await Site.findById(_id);
}

async function create(siteParam) {
    // validate
    if (!siteParam.subdomain) throw 'Subdomain is required';
    if (!validateSubdomain(siteParam.subdomain)) throw 'Subdomain is invalid'; 
    if (await Site.findOne({ subdomain: siteParam.subdomain })) {
        throw 'Subdomain "' + siteParam.subdomain + '" is already taken';
    }

    // save
    var site = new Site(siteParam);
    await site.save();
}

async function update(_id, siteParam) {
    var site = await Site.findById(_id);

    // validate
    if (!site) throw 'Site not found';
    if (!siteParam.subdomain) throw 'Subdomain is required';
    if (!validateSubdomain(siteParam.subdomain)) throw 'Subdomain is invalid';
    if (site.subdomain !== siteParam.subdomain && await Site.findOne({ subdomain: siteParam.subdomain })) { 
        throw 'Subdomain "' + siteParam.subdomain + '" is already taken';
    }    
    
    // update
    await site.update(siteParam);
}

async function _delete(_id) {
    await Site.findByIdAndRemove(_id);
}