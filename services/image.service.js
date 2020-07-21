var _ = require('lodash');
var Q = require('q');
var path = require('path');
var slugify = require('helpers/slugify');
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGODB_URI || process.env.CONNECTION_STRING, { native_parser: true });
db.bind('images');

var service = {};

service.get = get;
service.create = create;
service.getAvailableName = getAvailableName;
service.deleteImages = deleteImages;

module.exports = service;

function deleteImages(parentId) {
    db.images.deleteMany( { parentId });
}

function get(fileName) {
    var deferred = Q.defer();

    db.images.findOne({
        fileName: fileName
    }, function (err, image) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(image);
    });

    return deferred.promise;
}

function getAvailableName(originalName) {
    var deferred = Q.defer();

    var fileExtension = path.extname(originalName);
    var fileBaseSlug = slugify(path.basename(originalName, fileExtension));

    getAvailableNameHelper(fileBaseSlug, fileExtension, 0, function(availableName) {
        deferred.resolve(availableName);
    }, function() {
        deferred.reject('too many files with that name');
    });

    return deferred.promise;
}

function getAvailableNameHelper(fileBaseSlug, fileExtension, counter, foundCB, notFoundCB) {

    var fileSlug = fileBaseSlug + (counter === 0 ? "" : '-' + counter) + fileExtension;
    get(fileSlug).then(function(image){
        if (!image) {
            foundCB(fileSlug);
        } else if (counter < 20) {
            getAvailableNameHelper(fileBaseSlug, fileExtension, counter + 1, foundCB, notFoundCB);
        } else {
            notFoundCB();
        }
    });

}


function create({fileName, data, contentType, size, parentId}) {
    var deferred = Q.defer();

    db.images.insert(
        {fileName, data, contentType, size, parentId},
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
