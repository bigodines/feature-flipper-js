/* api contains an internal instance of feature_flipper that will be used in all public methods */
var feature_flipper = require('../../feature_flipper'),
ff_redis = require('../../storage/ff_redis')();

var ff = feature_flipper(ff_redis);

exports.create = function(req, res) {
    var new_feature = ff.save(req.body);
    res.send(JSON.stringify(new_feature));
};

exports.enableTo = function(req, res) {
    var handle_result = function(changed_feature) {
        res.status(200);
        res.send(JSON.stringify({id: changed_feature.id, message: "success"}));
    };
    
    var args = req.body;
    ff.enableTo(args.feature_id, args.user_id, handle_result);
};

exports.disableTo = function(req, res) {

};



