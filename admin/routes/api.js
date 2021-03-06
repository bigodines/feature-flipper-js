/* api contains an internal instance of feature_flipper that will be used in all public methods */
var feature_flipper = require('../../feature_flipper'),
ff_redis = require('../../storage/ff_redis')();

var ff = feature_flipper(ff_redis);

exports.create = function(req, res) {
    var handle_result = function(err, data) {
        if (err === null) {
            res.send(JSON.stringify(new_feature));
        } else {
            res.status(400);
            res.send(JSON.stringify({error: "400", message: "Invalid input"}));
        }
    };
    var raw_feature = ff.create_feature(req.body);
    var new_feature = ff.save(raw_feature, handle_result);
};

exports.enableTo = function(req, res) {
    var handle_result = function(changed_feature) {
        if (changed_feature !== null) {
            res.status(200);
            res.send(JSON.stringify({id: changed_feature.id, action:"enable", message: "success"}));
        } else {
            res.status(400);
            res.send(JSON.stringify({error: "400", message: "Invalid input: Feature or user does not exist"}));
            return;
        }
        
    };
    
    var args = req.body;
    ff.enableTo(args.feature_id, args.user_id, handle_result);
};

exports.disableTo = function(req, res) {
    var handle_result = function(changed_feature) {
        if (changed_feature !== null) {
            res.status(200);
            res.send(JSON.stringify({id: changed_feature.id, action: "disable", message: "success"}));
        } else {
            res.status(400);
            res.send(JSON.stringify({error: "400", message: "Invalid input: Feature or user does not exist"}));
            return;
        }
    };

    var args = req.body;
    ff.disableTo(args.feature_id, args.user_id, handle_result);
};

exports.remove = function(req, res) {
    var handle_result = function(changed_feature_id) {
        res.status(200);
        res.send(JSON.stringify({id: changed_feature_id, action: "remove", message: "success"}));
    };

    var args = req.body;
    ff.remove(args.feature_id, handle_result);
};

exports.check = function(req, res) {
    var args = req.body;
    var handle_result = function(feature_status) {
        var pretty_status = (feature_status) ? "enabled" : "disabled";
        res.status(200);
        res.send(JSON.stringify({id: args.feature_id, user: args.user_id, status: pretty_status}));
    };

    ff.check(args.feature_id, args.user_id, handle_result);
};
