var ldap = require('ldapjs');
module.exports = function(app) {
    app.get('/phonelist/getUserPhoneList', function (req, response) {

        var resultlist = [];
        var client = ldap.createClient({
            url: 'ldap://10.46.1.1:389'
        });
        client.bind('cn=domainadm,cn=Users,dc=mk,dc=local', 'Sqwerty1', function (err) {
            console.log(err);
            var opts = {
                filter: '(&(objectClass=user))',
                scope: 'sub',
                attributes: ['sAMAccountName', 'mail', 'sn', 'givenName', 'middleName', 'displayName', 'ipPhone', 'physicalDeliveryOfficeName', 'department', 'title','telephoneNumber']
            };
            client.search('ou=Users MK,dc=mk,dc=local', opts, function (err, res) {
                console.log(err);

                res.on('searchEntry', function (entry) {
                    resultlist.push(entry.object);

                });
                res.on('searchReference', function (referral) {
                    console.log('referral: ' + referral.uris.join());
                });
                res.on('error', function (err) {
                    console.error('error: ' + err.message);
                });
                res.on('end', function (result) {
                    console.log('status: ' + result.status);
                    response.status(200).send(resultlist);
                });
            });
        });
    })
}


