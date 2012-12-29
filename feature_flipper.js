(function() {
    feature_flipper = function(storage_engine) { 
        var _self = this;
        /* internals */
        /* Feature object */
        var _Feature = function(options) {
            var id, description, creation, expire, enabledTo;
            if (typeof options !== 'object') {
                throw new Error('please provide an option object');
            }
            
            for (var i in options) {
                this[i] = options[i];
            }
            
            if (this.id === undefined || this.description === undefined) {
                throw new Error('a feature must have an id and description');
            }
            
        };
        

        /* Feature Flipper public methods */
        return {
            storage : storage_engine,

            /* feature CRUD */
            create_feature : function(options) {
                return new _Feature(options);
            },

            get_feature: function(feature_id, dataHandler) {
                return this.storage.get('feature:'+feature_id, function(err, data) {
                    if (err) return undefined;
                    var serialized = data;
                    if (serialized && serialized.length > 0) {
                        dataHandler.call(this, JSON.parse(serialized));
                    }
                });
            },

            save : function(feature) {
                this.storage.set('feature:'+feature.id, JSON.stringify(feature), function() {});
                
                return feature;
            },

            delete : function(feature) {
                var id = (typeof feature === 'string') ? feature : feature.id;
                return this.storage.del('feature:'+ id);
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
                    callback.call(this,new_feature);
                };

                var deal_with_result = function (is_enabled) {
                    if (is_enabled === false) {
                        this.get_feature(feature_id, enable_feature);
                    }
                }

                this.check(feature_id, user_id, deal_with_result);
                // edit and enable feature
            },

            /*Feature Flipper logic */
            check : function(/* [ all optional params ], after_check_callback(bool is_enabled) */) {
                var feature, feature_id, context = this,
                    argc = arguments.length, 
                    check_cb, after_check, check_against,
                    _global_check = function(feature) {
                        return (feature.enabledTo === 'all');
                    };

                if (argc === 2) {
                    feature_id = arguments[0];
                    after_check = arguments[1];
                    check_cb = function(feature) {
                        var is_enabled = _global_check(feature);
                        after_check.call(this, is_enabled);
                    };

                } else if (argc === 3) {
                    feature_id = arguments[0];
                    check_against = arguments[1];
                    after_check = arguments[2];
                    check_cb = function(feature) { 
                        var is_enabled = _global_check(feature);
                        if (feature.enabledTo instanceof Array) {
                            var enabled_users = feature.enabledTo;
                            is_enabled = enabled_users.reduce(function(prev, curr, idx, arr) {
                                if (prev === true) return true;                         
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
