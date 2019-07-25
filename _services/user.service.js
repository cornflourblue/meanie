var bcrypt = require('bcryptjs');
var db = require('_db/db');
var User = db.User;

module.exports = UserService;

function UserService(user) {
    if (!(user && user.isSystemAdmin)) {
        throw 'Unauthorised';
    }

    Object.assign(this, {
        user,
        search,
        getAll,
        getById,
        create,
        update,
        delete: _delete
    });
}

async function search(query) {
    return await User
        .find({ username: new RegExp(query, "i") })
        .select('username');
}

async function getAll() {
    return await User
        .find()
        .select('-hash')
        .populate('sites', 'name');
}

async function getById(_id) {
    return await User.findById(_id)
        .select('-hash')
        .populate('sites', 'name');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    var user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    
    // save user
    await user.save();
}

async function update(_id, userParam) {
    var user = await User.findById(_id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);
    
    await user.save();
}

async function _delete(_id) {
    await User.findByIdAndRemove(_id);
}