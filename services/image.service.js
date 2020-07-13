var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var slugify = require('helpers/slugify');
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGODB_URI || config.connectionString, { native_parser: true });
db.bind('images');

var service = {};

service.get = get;
service.create = create;

module.exports = service;

function get(url) {
    var deferred = Q.defer();

    db.images.findOne({
        url: url
    }, function (err, image) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(image);
    });

    return deferred.promise;
}

function create({fileName, data, contentType, size, postId}) {
    var deferred = Q.defer();

    db.images.insert(
        {fileName, data, contentType, size, postId},
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
