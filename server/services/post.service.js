var _ = require('lodash');
var slugify = require('helpers/slugify');
var ObjectId = require('mongoose').Types.ObjectId;
var db = require('db/db');
var Post = db.Post;

module.exports = {
    getAll,
    getByUrl,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(siteId) {
    return await Post.find({ site: siteId })
        .sort({ publishDate: -1 });
}

async function getByUrl(year, month, day, slug) {
    return await Post.findOne({
        publishDate: year + '-' + month + '-' + day,
        slug: slug
    });
}

async function getById(_id) {
    return await Post.findById(_id);
}

async function create(postParam) {
    var post = new Post(postParam);

    // generate slug from title if empty
    postParam.slug = postParam.slug || slugify(postParam.title);

    // validate
    var duplicatePost = await Post.findOne({ slug: postParam.slug });
    if (duplicatePost) {
        throw 'Slug "' + postParam.slug + '" is already taken by post: "' + duplicatePost.title + '"';
    }

    await post.save();
}

async function update(_id, postParam) {
    var post = await Post.findById(_id);

    // generate slug from title if empty
    postParam.slug = postParam.slug || slugify(postParam.title);

    // validate
    if (!post) throw 'Post not found';
    if (post.slug !== postParam.slug) {
        var duplicatePost = await Post.findOne({ slug: postParam.slug });
        if (duplicatePost) {
            throw 'Slug "' + postParam.slug + '" is already taken by post: "' + duplicatePost.title + '"';
        }
    }

    // copy postParam properties to user
    post = Object.assign(post, postParam);

    await post.save();
}

async function _delete(_id) {
    await Post.findByIdAndRemove(_id);
}