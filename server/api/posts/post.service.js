var _ = require('lodash');
var slugify = require('helpers/slugify');
var db = require('../helpers/db');
var Post = db.Post;

module.exports = PostService;

function PostService(site, user) {
    if (!site) throw 'Site is required to access posts';
    if (user && !site.users.find(x => x.equals(user._id))) throw 'User is not authorised to access posts for this site';

    Object.assign(this, {
        site,
        user,
        getAll,
        getByUrl,
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

    return await Post
        .find(conditions)
        .sort({ publishDate: -1 });
}

async function getByUrl(year, month, day, slug) {
    var conditions = {
        site: this.site._id,
        publishDate: year + '-' + month + '-' + day,
        slug
    };

    if (!this.user) {
        // return only published for unauthenticated users
        conditions.publish = true;
    }

    return await Post.findOne(conditions);
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

    return await Post.findOne(conditions);
}

async function create(postParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';

    var post = new Post(postParam);

    // generate slug from title if empty
    post.slug = post.slug || slugify(post.title);

    // validate
    var duplicatePost = await Post.findOne({
        site: this.site._id,
        slug: post.slug
    });
    if (duplicatePost) {
        throw 'Slug "' + post.slug + '" is already taken by post: "' + duplicatePost.title + '"';
    }

    post.site = this.site._id;
    post.createdBy = this.user._id;
    post.createdDate = Date.now();

    await post.save();
}

async function update(_id, postParam) {
    // authorise
    if (!this.user) throw 'Unauthorised';
    
    var post = await Post.findOne({
        site: this.site._id,
        _id
    });

    // generate slug from title if empty
    postParam.slug = postParam.slug || slugify(postParam.title);

    // validate
    if (!post) throw 'Post not found';
    if (post.slug !== postParam.slug) {
        // slug updated so check for duplicate
        var duplicatePost = await Post.findOne({
            site: this.site._id,
            slug: postParam.slug
        });
        if (duplicatePost) {
            throw 'Slug "' + postParam.slug + '" is already taken by post: "' + duplicatePost.title + '"';
        }
    }

    // remove properties that can't be updated
    delete postParam.site;
    delete postParam.createdBy;
    delete postParam.createdDate;

    // copy postParam properties to post
    Object.assign(post, postParam);

    await post.save();
}

async function _delete(_id) {
    await Post.findOneAndRemove({
        site: this.site._id,
        _id
    });
}