(function () {
  var _redis = require('redis'),

    ff_redis = function (port, host, options) {
      var ret, redis = _redis.createClient(port, host, options);
      /* public methods*/
      return {
        set: function (key, value, cb) {
          redis.set(key, value, function (err, data) {
            if (!cb) {
              return;
            }
            cb(err, data);
          });
        },
        get: function (key, cb) {
          redis.get(key, function (err, data) {
            if (!cb) {
              return;
            }
            cb(err, data);
          });

        },
        del: function (key, cb) {
          redis.del(key, cb);
        }
      };
    };

  module.exports = ff_redis;
})();
