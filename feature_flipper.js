"use strict";
(function() {
    var feature_flipper = function(storage_engine) {
        /* internals */
        /* Feature object */
        var Feature = function(options) {
            var id, description, creation, expire, enabledTo; // jshint ignore:line
            if (typeof options !== 'object') {
                throw new Error('please provide an option object');
            }

            for (var i in options) {
                this[i] = options[i];
            }

        };


        /* Feature Flipper public methods */
        return {
            storage : storage_engine,

            /* create feature won't persist the new feature in the storage engine until it is saved */
            create_feature : function(options) {
                return new Feature(options);
            },

            get_feature: function(feature_id, data_handler) {
                return this.storage.get('feature:'+feature_id, function(err, data) {
                    if (err || data === null) {
                        data_handler.call(this, null);
                    }
                    var serialized = data;
                    if (serialized && serialized.length > 0) {
                        data_handler.call(this, JSON.parse(serialized));
                    }
                });
            },

            save : function(feature, data_handler) {
                if (typeof data_handler == 'undefined') {
                    data_handler = function(err, data) { return data; };
                }

                if (feature.id === undefined || feature.description === undefined) {
                    data_handler('A feature should have at least ID and DESCRIPTION');
                    return feature;
                }

                this.storage.set('feature:'+feature.id, JSON.stringify(feature), data_handler);

                return feature;
            },

            remove : function(feature, callback) {
                var id = (typeof feature === 'string') ? feature : feature.id;
                this.storage.del('feature:'+ id);
                if (typeof callback !== 'undefined') {
                    callback(id);
                }
            },

            enableTo : function(feature_id, user_id, callback) {
                var _self = this;
                var enable_feature = function(feature) {
                    if (user_id === 'all') {
                        feature.enabledTo = 'all';
                    } else {
                        if (feature.enabledTo instanceof Array) {
                            feature.enabledTo.push(user_id);
                        } else {
                            feature.enabledTo = new Array(user_id);
                        }
                    }
                    var new_feature = _self.save(feature);
                    callback.call(this, new_feature);
                };

                var deal_with_result = function (is_enabled) {
                    if (is_enabled === null) {
                        callback.call(this, null);
                        return;
                    }
                    if (is_enabled === false) {
                        this.get_feature(feature_id, enable_feature);
                    } else {
                        this.get_feature(feature_id, callback);
                    }
                };

                this.check(feature_id, user_id, deal_with_result);
            },

            //TODO: merge disableTo and enableTo into one single function
            disableTo : function(feature_id, user_id, callback) {
                var _self = this;
                var disable_feature = function(feature) {
                    if (user_id === 'all') {
                        delete(feature.enabledTo);
                    } else {
                        if (feature.enabledTo instanceof Array) {
                            var enabled_users = feature.enabledTo;
                            var current_position = enabled_users.indexOf(user_id);
                            if (current_position >= 0) {
                                enabled_users.splice(current_position,1);
                                if(enabled_users.length === 0) {
                                    delete(feature.enabledTo);
                                } else {
                                    feature.enabledTo = enabled_users;
                                }
                            }
                        }
                    }
                    var new_feature = _self.save(feature);
                    callback.call(this, new_feature);
                };

                var deal_with_result = function (is_enabled) {
                    if (is_enabled === true) {
                        this.get_feature(feature_id, disable_feature);
                    } else {
                        this.get_feature(feature_id, callback);
                    }
                };

                this.check(feature_id, user_id, deal_with_result);
            },

            /*Feature Flipper logic */
            check : function(/* [ all optional params ], after_check_callback(bool is_enabled) */) {
                var feature_id, context = this,
                    argc = arguments.length,
                    check_cb, after_check, check_against,
                    _global_check = function(feature) {
			    if (feature === null) {
				 after_check.call(context, null);
			    }
			    return (feature.enabledTo === 'all');
                    };

                if (argc === 2) {
                    feature_id = arguments[0];
                    after_check = arguments[1];
                    check_cb = function(feature) {
                        if (feature === null) {
                            after_check.call(context, null);
                            return;
                        }
                        var is_enabled = _global_check(feature);
                        after_check.call(this, is_enabled);
                    };

                } else if (argc === 3) {
                    feature_id = arguments[0];
                    check_against = arguments[1];
                    after_check = arguments[2];
                    check_cb = function(feature) {
                        if (feature === null) {
                            after_check.call(context, null);
                            return;
                        }
                        var is_enabled = _global_check(feature);
                        if (feature.enabledTo instanceof Array) {
                            var enabled_users = feature.enabledTo;
                            is_enabled = enabled_users.reduce(function(prev, curr, idx, arr) {
                                if (prev === true) {  return true; }
                                return (curr === check_against);
                            }, false);
                        }

                        after_check.call(context, is_enabled);
                    };
                }

                context.get_feature(feature_id, check_cb);
            }
        };
    };

    module.exports = feature_flipper;
})();
