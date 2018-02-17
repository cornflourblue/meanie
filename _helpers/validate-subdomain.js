module.exports = validatSubdomain;

function validatSubdomain(subdomain) {
    var regex = /^([a-z0-9]+(-[a-z0-9]+)*)$/;
    return regex.test(subdomain);
}