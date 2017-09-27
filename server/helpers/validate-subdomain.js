module.exports = validateSubdomain;

function validateSubdomain(domain) {
    var regex = /^([a-z0-9]+(-[a-z0-9]+)*)$/;
    return regex.test(domain);
}