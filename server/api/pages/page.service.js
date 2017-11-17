var _ = require('lodash');
var slugify = require('helpers/slugify');
var db = require('../helpers/db');
var Page = db.Page;

module.exports = PageService;

function PageService(user, site) {
    Object.assign(this, {
        user,
        site,
        getAll,
        getBySlug,
        getById,
        create,
        update,
        delete: _delete
    });
}

async function getAll() {
    var pages = await Page.find();
    return _.sortBy(pages, function (p) { return p.title.toLowerCase(); });
}

async function getBySlug(slug) {
    return await Page.findOne({ slug });
}

async function getById(_id) {
    return await Page.findById(_id);
}

async function create(pageParam) {
    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    // save
    var page = new Page(pageParam);
    await page.save();
}

async function update(_id, pageParam) {
    var page = await Page.findById(_id);

    // validate
    if (!page) throw 'Page not found';

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    // update
    await page.update(pageParam);
}

async function _delete(_id) {
    await Page.findByIdAndRemove(_id);
}