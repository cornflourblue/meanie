var config = require('config.json');
var _ = require('lodash');
var db = require('_db/db');
var Redirect = db.Redirect;

module.exports = RedirectService;

function RedirectService(site, user) {
    if (!site) throw 'Site is required to access redirects';
    if (user && !user.isSystemAdmin && !site.users.find(x => x.equals(user._id))) throw 'User is not authorised to access redirects for this site';

    Object.assign(this, {
        site,
        user,
        getAll,
        getByFrom,
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

    return await Redirect
        .find(conditions)
        .sort({ from: 1 });
}

async function getByFrom(from) {
    var conditions = {
        site: this.site._id,
        from
    };

    if (!this.user) {
        // return only published for unauthenticated users
        conditions.publish = true;
    }

    return await Redirect.findOne(conditions);
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

    return await Redirect.findOne(conditions);
}

async function create(redirectParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';

    var redirect = new Redirect(redirectParam);

    // ensure to and from are lowercase
    redirect.from = redirect.from && redirect.from.toLowerCase();
    redirect.to = redirect.to && redirect.to.toLowerCase();

    // validate
    var duplicateRedirect = await Redirect.findOne({
        site: this.site._id,
        from: redirect.from
    });
    if (duplicateRedirect) {
        throw 'There is already a redirect from "' + redirect.from + '"';
    }

    redirect.site = this.site._id;
    redirect.createdBy = this.user._id;
    redirect.createdDate = Date.now();

    await redirect.save();
}

async function update(_id, redirectParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';

    var redirect = await Redirect.findOne({
        site: this.site._id,
        _id
    });

    // ensure to and from are lowercase
    redirectParam.from = redirectParam.from && redirectParam.from.toLowerCase();
    redirectParam.to = redirectParam.to && redirectParam.to.toLowerCase();

    // validate
    if (!redirect) throw 'Redirect not found';
    if (redirect.from !== redirectParam.from) {
        // from updated so check for duplicate
        var duplicateRedirect = await Redirect.findOne({
            site: this.site._id,
            from: redirectParam.from
        });
        if (duplicateRedirect) {
            throw 'There is already a redirect from "' + redirectParam.from + '"';
        }
    }

    // remove properties that can't be updated
    delete redirectParam.site;
    delete redirectParam.createdBy;
    delete redirectParam.createdDate;

    // copy redirectParam properties to redirect
    Object.assign(redirect, redirectParam);

    await redirect.save();
}

async function _delete(_id) {
    await Redirect.findOneAndRemove({
        site: this.site._id,
        _id
    });
}