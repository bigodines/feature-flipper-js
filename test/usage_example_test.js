var feature_flipper = require('../feature_flipper'),
    ff_redis = require('../storage/ff_redis')();    

/* Usage Scenarios (not tests) */
describe('Feature Flipper Usage Examples', function() {
    describe('Happy paths', function() {
	/* Create your set of features*/
	var ff = feature_flipper(ff_redis);
	ff.create_feature({id: 'header', description: 'Site header', enabledTo : 'all'});
	ff.create_feature({id: 'new_message_bar_layout', description: 'Testing the new messagebar layout with some users', enabledTo : ['johnny', 'mark', 'ron', 'some executive']});
	ff.create_feature({id: 'bugfix #35', description: 'Attempt to fix bug #35 of some product', enabledTo : ['qa_user_1', 'tati', 'johnny']});

	var render_feature = function(){}, render_something_else = function(){};

	it('should allow johnny to see every feature', function(done) {
	    ff.check('header', 'johnny', function(is_enabled) { 
		if (is_enabled) {
		    render_feature();
		} else {
		    render_something_else();
		}
	    });

	    ff.check('new_message_bar_layout', 'johnny', function(is_enabled) { 
		return is_enabled ? render_feature() : render_something_else();
	    });

	    ff.check('bugfix #35', 'johnny', function(is_enabled) {
		return is_enabled ? render_feature() : render_something_else();
	    });
	    done();
	});

    });

});
