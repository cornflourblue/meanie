var db = require('../helpers/db');
var Site = db.Site;

module.exports = SiteService;

function SiteService(user) {
    if (!user) {
        throw 'Unauthorised';
    }

    Object.assign(this, {
        user,
        search,
        getAll,
        getById,
        create,
        update,
        delete: _delete
    });
}

async function search(query) {
    return await Site
        .find({ name: new RegExp(query, "i") })
        .select('name');
}

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
    
    await site.update(siteParam);
}

async function _delete(_id) {
    await Site.findByIdAndRemove(_id);
}