var _redis = require('redis'),
    redis = _redis.createClient();

(function() {
    ff_redis = function() {
	var ret;
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
