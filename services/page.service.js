var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var slugify = require('helpers/slugify');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('pages');

var service = {};

service.getAll = getAll;
service.getBySlug = getBySlug;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.pages.find().toArray(function (err, pages) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        pages = _.sortBy(pages, function (p) { return p.title.toLowerCase(); });

        deferred.resolve(pages);
    });

    return deferred.promise;
}

function getBySlug(slug) {
    var deferred = Q.defer();

    db.pages.findOne({
        slug: slug
    }, function (err, page) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(page);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.pages.findById(_id, function (err, page) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(page);
    });

    return deferred.promise;
}

function create(pageParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    db.pages.insert(
        pageParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, pageParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    // fields to update
    var set = _.omit(pageParam, '_id');

    db.pages.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.pages.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}