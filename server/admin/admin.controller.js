var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var slugify = require('helpers/slugify');
var fileExists = require('helpers/file-exists');

router.use('/', ensureAuthenticated);
router.post('/upload', getUpload().single('upload'), upload); // handle file upload
router.use('/', express.static('../client/admin')); // serve admin front end files from '/admin'

module.exports = router;

/* ROUTE FUNCTIONS
---------------------------------------*/

function upload(req, res, next) {
    // respond with ckeditor callback
    res.status(200).send(
        '<script>window.parent.CKEDITOR.tools.callFunction(' + req.query.CKEditorFuncNum + ', "/_content/uploads/' + req.file.filename + '");</script>'
    );
}


/* MIDDLEWARE FUNCTIONS
---------------------------------------*/

function ensureAuthenticated(req, res, next) {
    // use session auth to secure the front end admin files
    if (!req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/admin' + req.path));
    }

    next();
}

/* HELPER FUNCTIONS
---------------------------------------*/

function getUpload() {
    // file upload config using multer
    var uploadDir = '../client/blog/_content/uploads';

    var storage = multer.diskStorage({
        destination: uploadDir,
        filename: function (req, file, cb) {
            var fileExtension = path.extname(file.originalname);
            var fileBase = path.basename(file.originalname, fileExtension);
            var fileSlug = slugify(fileBase) + fileExtension;

            // ensure file name is unique by adding a counter suffix if the file exists
            var fileCounter = 0;
            while (fileExists(path.join(uploadDir, fileSlug))) {
                fileCounter += 1;
                fileSlug = slugify(fileBase) + '-' + fileCounter + fileExtension;
            }

            cb(null, fileSlug);
        }
    });
    var upload = multer({ storage: storage });

    return upload;
}