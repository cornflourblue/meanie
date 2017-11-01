var db = require('db/db');
var Site = db.Site;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Site
        .find()
        .populate('users', 'username');
}

async function getById(_id) {
    return await Site
        .findById(_id)
        .populate('users', 'username');
}

async function create(siteParam) {
    var site = new Site(siteParam);
    await site.save();
}

async function update(_id, siteParam) {
    var site = await Site.findById(_id);

    // validate
    if (!site) throw 'Site not found';
    
    // update
    await site.update(siteParam);
}

async function _delete(_id) {
    await Site.findByIdAndRemove(_id);
}