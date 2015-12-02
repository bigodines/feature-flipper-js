"use strict";

(function () {
    var features = [];
    var ff_memory = function() {
        /*
         * This is the bare basics storage for features.
         * It has been written so that one does not have to have
         * redis or memcache or any other external tools to make sure
         * feature_flipper's code is working
         **/

        return {
            set: function(key, value, cb) {
                features[key] = value;
                cb(null, features[key]);
            },

            get: function(key, cb) {
                cb(null, features[key]);
            },

            del: function(key, cb) {
                if (delete features[key]) {
                    cb(null, features);
                } else {
                    cb('could not delete', null); // explicitly passing "null" as data to improve readability
                }
            }
        }
    }

    module.exports = ff_memory;
})();
