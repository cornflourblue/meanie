var config = require('config.json');
var _ = require('lodash');
var db = require('../helpers/db');
var Redirect = db.Redirect;

module.exports = RedirectService;

function RedirectService(site, user) {
    if (!site) throw 'Site is required to access redirects';
    if (user && !site.users.find(x => x.equals(user._id))) throw 'User is not authorised to access redirects for this site';

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

function getAll() {
    var deferred = Q.defer();

    db.redirects.find().toArray(function (err, redirects) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(redirects);
    });

    return deferred.promise;
}

function getByFrom(from) {
    var deferred = Q.defer();

    db.redirects.findOne({
        from: from
    }, function (err, redirect) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(redirect);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.redirects.findById(_id, function (err, redirect) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(redirect);
    });

    return deferred.promise;
}

function create(redirectParam) {
    var deferred = Q.defer();

    // validate 
    var errors = [];
    if (!redirectParam.from) { errors.push('From is required'); }
    if (!redirectParam.to) { errors.push('To is required'); }

    if (!errors.length) {
        // ensure to and from are lowercase
        redirectParam.from = redirectParam.from.toLowerCase();
        redirectParam.to = redirectParam.to.toLowerCase();

        db.redirects.insert(
            redirectParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    } else {
        deferred.reject(errors.join('\r\n'));
    }

    return deferred.promise;
}

function update(_id, redirectParam) {
    var deferred = Q.defer();

    // validate 
    var errors = [];
    if (!redirectParam.from) { errors.push('From is required'); }
    if (!redirectParam.to) { errors.push('To is required'); }

    if (!errors.length) {
        // ensure to and from are lowercase
        redirectParam.from = redirectParam.from.toLowerCase();
        redirectParam.to = redirectParam.to.toLowerCase();

        // fields to update
        var set = _.omit(redirectParam, '_id');

        db.redirects.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    } else {
        deferred.reject(errors.join('\r\n'));
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.redirects.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}