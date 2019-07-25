var _ = require('lodash');
var slugify = require('_helpers/slugify');
var db = require('_db/db');
var Page = db.Page;

module.exports = PageService;

function PageService(site, user) {
    if (!site) throw 'Site is required to access pages';
    if (user && !user.isSystemAdmin && !site.users.find(x => x.equals(user._id))) throw 'User is not authorised to access pages for this site';

    Object.assign(this, {
        site,
        user,
        getAll,
        getBySlug,
        getById,
        create,
        update,
        delete: _delete
    });
}

async function getAll() {
    var conditions = { site: this.site._id };

    if (!this.user) {
        // return only published for unauthenticated users
        conditions.publish = true;
    }

    var pages = await Page.find(conditions);

    // for case insensitive sorting
    return _.sortBy(pages, function (p) { return p.title.toLowerCase(); });
}

async function getBySlug(slug) {
    var conditions = {
        site: this.site._id,
        slug
    };

    if (!this.user) {
        // return only published for unauthenticated users
        conditions.publish = true;
    }

    return await Page.findOne(conditions);
}

async function getById(_id) {
    var conditions = {
        site: this.site._id,
        _id
    };

    if (!this.user) {
        // return only published for unauthenticated users
        conditions.publish = true;
    }

    return await Page.findOne(conditions);
}

async function create(pageParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';

    var page = new Page(pageParam);

    // generate slug from title if empty
    page.slug = page.slug || slugify(page.title);

    // validate
    var duplicatePage = await Page.findOne({
        site: this.site._id,
        slug: page.slug
    });
    if (duplicatePage) {
        throw 'Slug "' + page.slug + '" is already taken by page: "' + duplicatePage.title + '"';
    }

    page.site = this.site._id;
    page.createdBy = this.user._id;
    page.createdDate = Date.now();

    await page.save();
}

async function update(_id, pageParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';

    var page = await Page.findOne({
        site: this.site._id,
        _id
    });

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    // validate
    if (!page) throw 'Page not found';
    if (page.slug !== pageParam.slug) {
        // slug updated so check for duplicate
        var duplicatePage = await Page.findOne({
            site: this.site._id,
            slug: pageParam.slug
        });
        if (duplicatePage) {
            throw 'Slug "' + pageParam.slug + '" is already taken by page: "' + duplicatePage.title + '"';
        }
    }

    // remove properties that can't be updated
    delete pageParam.site;
    delete pageParam.createdBy;
    delete pageParam.createdDate;

    // copy postParam properties to post
    Object.assign(page, pageParam);

    await page.save();
}

async function _delete(_id) {
    await Page.findOneAndRemove({
        site: this.site._id,
        _id
    });
}