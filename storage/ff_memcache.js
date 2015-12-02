"use strict";
(function () {
    var _memjs = require('memjs');
    var ff_memcache = function(servers, options) {
        var mc = _memjs.Client.create(servers, options);
        return {
            name: 'memcache',
            set: function(key, value, cb) {
                mc.set(key, value, cb);
            },

            get: function(key, cb) {
                mc.get(key, cb);
            },

            del: function(key, cb) {
                mc.delete(key, cb);
            }
        }
    }

    module.exports = ff_memcache;
})();
