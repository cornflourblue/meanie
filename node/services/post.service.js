var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('posts');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.posts.find().toArray(function (err, posts) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(posts);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.posts.findById(_id, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(post);
    });

    return deferred.promise;
}

function create(postParam) {
    var deferred = Q.defer();

    db.posts.insert(
        postParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, postParam) {
    var deferred = Q.defer();

    // fields to update
    var set = _.omit(postParam, '_id');

    db.posts.update(
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

    db.posts.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}