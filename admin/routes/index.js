var redis = require('redis').createClient();

/*
 * GET home page.
 */

exports.index = function(req, res){
    redis.keys('feature:*', function(err, data) {
        var features = [];
        for(var i=0; i < data.length; i++) {
            features.push(data[i].substring('feature:'.length));
        }
        res.render('index', { features : features });
    });
};

exports.login = function(req, res) {
    var user = req.body.username;
    var password = req.body.userpass;

    if (user === 'admin' && password === 'featureflipper') {
        req.session.login = 'admin';
        exports.index(req,res);
    }
    else {
        res.render('login', {error: 'Invalid Login'});
    }
};

