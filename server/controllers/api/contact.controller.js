var config = require('config.json');
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

// routes
router.post('/', send);

module.exports = router;

function send(req, res) {
    // email data and options
    var mailOptions = {
        from: req.body.email,
        to: config.contactEmail,
        subject: req.body.subject,
        text: req.body.message
    };

    // send mail
    var transporter = nodemailer.createTransport();
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log('error sending email', err);
            return res.status(400).send(err);
        }

        res.sendStatus(200);
    });
}