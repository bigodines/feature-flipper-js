var redis = require('redis').createClient();

/*
 * GET home page.
 */

exports.index = function(req, res){
    redis.keys('feature:*', function(err, data) {
        var features = [];
        var a = redis.mget(data, function(err, all_features) {
            if (all_features !== undefined) {
                for(var i=0; i < all_features.length; i++) {
                    var feature = JSON.parse(all_features[i]);
                    features.push(feature);
                }
            }
            res.render('index', { features : features });
        });
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

exports.createFeature = function(req, res) {
    res.render('featureForm', {target: '/v1/create/'});
}
