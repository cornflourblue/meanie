var userService = require('_services/user.service');

module.exports = siteId;

function siteId(req, res, next) {
    // check for site id header
    req.siteId = req.get('MEANie-Site-Id');

    if (!req.siteId) {
        return res.status(400).send('Site Id header missing');
    }

    if (req.user && req.user.sub) {
        userService.getById(req.user.sub)
            .then(user => {
                // TODO: check that user has access to site
                console.log('current user', user);
                
                next();
            })
            .catch(err => res.status(400).send(err));
    } else {
        next();
    }
}