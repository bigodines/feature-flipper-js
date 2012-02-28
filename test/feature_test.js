var should = require('should'),
    flipper = require('../feature_flipper');
    


describe('Feature', function() {
    it('feature_flipper::create_feature() must take option arguments', function() {
	var good_feature = flipper().create_feature({id: 'my id', description: 'some nice feature'});
	good_feature.id.should.equal('my id');

    });
    it('blah', function() {
	var bad_feature = flipper;
	try {
	    bad_feature.create_feature();
	} catch (err) {
	    should.ok('passed'); return;
	}
	should.fail('Should have thrown an exception');
    });

    it('feature MUST have ID and DESCRIPTION', function() {
	var another_bad_feature = flipper;
	try {
	    another_bad_feature.create_feature({john: 'doe'});
	} catch(err) {
	    should.ok('nice!'); return;
	}
	should.fail('Should have thrown an exception');

    });

});

describe('How Feature Flipper deals with features', function() {
    var StorageStub = {
	set : function(id, data) { return data; },
	del : function(id) { return 1; },
	get : function(id) { return JSON.stringify({ id : id, description: 'some description' });}
    },

    FeatureStub = function() {
	var id = 1;
	return this;
    };

    it('should be able to save a feature', function () {
	var feature = new FeatureStub();
	feature.id = 'foo';
	var ff = flipper();
	ff.storage = StorageStub;
	var data = ff.save(feature);
	should.equal(data.id, feature.id);
    });

    it('should be able to delete a feature', function() {
	var feature = new FeatureStub();
	feature.id = 'foo';
	var ff = flipper();
	ff.storage = StorageStub;
	var result = ff.delete(feature);
	should.equal(1, result);
    });

    it('should return a feature object given a feature_id', function() {
	var expected = JSON.stringify({id: 'feature:some_id', description : 'some description'});
	var ff = flipper();
	ff.storage = StorageStub;
	var feature = ff.get_feature('some_id');
	expected.should.eql(feature);
    });
});

describe('Feature Flipper check', function() {
    var StorageStub = {
	set : function(id, data) { return data; },
	del : function(id) { return 1; },
	get : function(id) { 
	    if (id == 'i dont exist') {
		return null;
	    }
	    if (id == 'enabled_feature') {
	    }
	}
    };

    it('should default to disable', function() {
	var ff = flipper();
	ff.storage = StorageStub;
	var isEnabled = ff.check('i dont exist');
	isEnabled.should.equal(false);
    });

    /*integration tests*/
    it('should check if feature is enabled globally when receives one argument', function(done) {
	var ff = flipper();
	ff.storage = require('../storage/ff_redis')();
	var f = ff.create_feature({id : 'enabled_feature', description : 'enabled to everyone', enabledTo: 'all'});
	ff.save(f);
	ff.check('enabled_feature', function(result) {
	    console.log(result);
	    result.should.equal(true);
	    done();
	} );
	// isEnabled = ff.check('disabled_feature');
	// isEnabled.should.equal(false);
    });

});

/*

usage brainstorm

feature = flipper().create_feature({id: 1, description: 'nice'});
feature.save();
feature.enableToAll();
feature.enableTo(guid);
feature.check(guid);


feature = feature_flipper.create_feature({...});

feature_flipper.get_feature(feature_id);
feature_flipper.check(feature, guid);
feature_flipper.enable(feature, guid);
feature_flipper.enable(feature);

// phase 2

feature_flipper.add_guid_to_group(guid, group);


*/
