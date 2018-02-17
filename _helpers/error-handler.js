module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).send(err);
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).send(err.message);
    }

    // default to 500 server error
    return res.status(500).send(err.message);
}