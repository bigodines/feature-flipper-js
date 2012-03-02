(function() {
    feature_flipper = function() { 
	/* internals */
	/* Feature object */
	var _Feature = function(options) {
	    var id, description, creation, expire;
	    if (typeof options !== 'object') {
		throw new Error('please provide an option object');
	    }
	    
	    for (var i in options) {
		this[i] = options[i];
	    }
	    
	    if (this.id == undefined || this.description == undefined) {
		throw new Error('a feature must have an id and description');
	    }

	};
	

	/* Feature Flipper public methods */
	return {
	    // TODO: replace with redis.
	    storage : function() {},

	    /* feature CRUD */
	    create_feature : function(options) {
		return new _Feature(options);
	    },

	    get_feature: function(feature_id, dataHandler) {
		return this.storage.get('feature:'+feature_id, function(err, data) {
		    if (err) return undefined;
		    var serialized = data;
		    if (serialized && serialized.length > 0) {
			dataHandler(JSON.parse(serialized));
		    }
		});
	    },

	    save : function(feature) {
		this.storage.set('feature:'+feature.id, JSON.stringify(feature));
		
	        return feature;
	    },

	    delete : function(feature) {
		return this.storage.del('feature:'+feature.id);
	    },

	    /*Feature Flipper logic */
	    check : function(/* [ all optional params ], after_check_callback */) {
		var feature, feature_id,
		    argc = arguments.length, 
		    isEnabled = false, check_cb, after_check, check_against;
		if (argc === 2) {
		    feature_id = arguments[0];
		    after_check = arguments[1];
		    check_cb = function(feature) {
			var is_enabled = false;
 			if (feature.enabledTo === 'all') {
			    is_enabled = true;
			};
			after_check.call(this, is_enabled);
		    };

		} else if (argc === 3) {
		    feature_id = arguments[0];
		    check_against = arguments[1];
		    after_check = arguments[2];
		    
		    check_cb = function(feature) { 
			var is_enabled = false;
			if (feature.enabledTo === 'all') { 
			    is_enabled = true;
			};
			after_check.call(this, is_enabled);
		    };
		};

		this.get_feature(feature_id, check_cb);
	    }
	};
    };

    module.exports = feature_flipper;
})();
