exports.api = (api = function() {
    /* api contains an internal instance of feature_flipper that will be used in all public methods */
    var feature_flipper = require('../../feature_flipper'),
        ff_redis = require('../../storage/ff_redis')();

    var ff = feature_flipper(ff_redis);

    return {
        create : function(req, res) {
            var new_feature = ff.save(req.body);
            res.send(JSON.stringify(new_feature));
        },

        enableTo : function(req, res) {
            res.status(201);
        }
    }

})();

