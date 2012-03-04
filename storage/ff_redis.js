(function() {
    var _redis = require('redis'),

    ff_redis = function(port, host, options) {
	var ret,
	redis = _redis.createClient(port, host, options);
	/* public methods*/
	return {
	    set : function(key, value, cb) {
		return redis.set(key, value, cb);
	    },
	    get : function(key, cb) {
		redis.get(key, function(err, data){
		    cb(err, data);
		});

	    },
	    del : function(key, cb) {
		return redis.del(key, cb);
	    },
	}
    };

    module.exports = ff_redis;
})();
