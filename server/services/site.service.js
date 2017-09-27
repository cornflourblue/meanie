var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var validateSubdomain = require('helpers/validate-subdomain');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('sites');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.sites.find().toArray(function (err, sites) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(sites);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.sites.findById(_id, function (err, site) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(site);
    });

    return deferred.promise;
}

function create(siteParam) {
    var deferred = Q.defer();

    // validate 
    var errors = [];
    if (!siteParam.subdomain) { 
        errors.push('Subdomain is required'); 
    } else if (!validateSubdomain(siteParam.subdomain)) {
        errors.push('Subdomain is invalid'); 
    }

    if (errors.length) {
        deferred.reject(errors.join('\r\n'));
    } else {
        // check if subdomain taken
        db.sites.findOne(
            { subdomain: siteParam.subdomain },
            function (err, site) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if (site) {
                    // subdomain already exists
                    deferred.reject('Subdomain "' + siteParam.subdomain + '" is already taken');
                } else {
                    // all good so create site
                    createSite();
                }
            });
    }

    function createSite() {
        db.sites.insert(
            siteParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, siteParam) {
    var deferred = Q.defer();

    // validate 
    var errors = [];
    if (!siteParam.subdomain) { 
        errors.push('Subdomain is required'); 
    } else if (!validateSubdomain(siteParam.subdomain)) {
        errors.push('Subdomain is invalid'); 
    }

    if (!errors.length) {
        // fields to update
        var set = _.omit(siteParam, '_id');

        db.sites.update(
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

    db.sites.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}