var should = require('should'),
    flipper = require('../feature_flipper'),
    ff_redis = require('../storage/ff_redis')();


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

    StorageStubFactory = function(expected_set_return, expected_del_return, expected_get_return) {
        return {
            set : function(id, data, cb) { 
                cb(null,expected_set_return); 
            },
            del : function(id, cb) { 
                cb(null,expected_del_return);
            },
            get : function(id, cb) { 
                cb(null,JSON.stringify(expected_get_return));
            }
        }
    },

    FeatureStub = function() {
        return {
	    id : 1
        }
    };

    it('should be able to save a feature', function () {
	var feature = new FeatureStub();
	feature.id = 'foo';
	var ff = flipper(StorageStub);
	var data = ff.save(feature);
	should.equal(data.id, feature.id);
    });

    it('should be able to delete a feature', function() {
	var feature = new FeatureStub();
	feature.id = 'foo';
	var ff = flipper(StorageStub);
	var result = ff.delete(feature);
	should.equal(1, result);
    });

    it('should return a feature object given a feature_id', function() {
	var expected = JSON.stringify({id: 'feature:some_id', description : 'some description'});
	var ff = flipper(StorageStub);
	var feature = ff.get_feature('some_id');
	expected.should.eql(feature);
    });

    it('should be able to enable a feature to all after it has been created', function(done) {
        // test setup
        var fake_feature = new FeatureStub();
        var expected_feature = new FeatureStub();
        expected_feature.enabledTo = 'all';
        
        var storageMock = StorageStubFactory(expected_feature, null, fake_feature);

        var asyncTest = function(result) {
            result.should.eql(expected_feature);
            done();
        }

        var ff = flipper(storageMock);
        ff.enableTo(1, 'all', asyncTest);

    });

    it('should be able to enable a feature to an user', function(done) {
        // test setup
        var fake_feature = new FeatureStub();
        var expected_feature = new FeatureStub();
        expected_feature.enabledTo = ['john'];
        
        var storageMock = StorageStubFactory(expected_feature, null, fake_feature);

        var asyncTest = function(result) {
            result.should.eql(expected_feature);
            done();
        }

        var ff = flipper(storageMock);
        ff.enableTo(1, 'john', asyncTest);

        
    });
});

/*integration tests*/
describe('Feature Flipper check (integration)', function(done) {
    var ff = flipper(ff_redis);
    it('should default to disable', function() {
	ff.check('i dont exist', function(isEnabled) {
	    isEnabled.should.equal(false);
	    done();
	});
    });

    it('should check if feature is enabled globally when receives one argument', function(done) {
	var f = ff.create_feature({id : 'enabled_feature', description : 'enabled to everyone', enabledTo: 'all'});
	ff.save(f);
	ff.check('enabled_feature', function(result) {
	    result.should.equal(true);
	    ff.delete('enabled_feature');
	    done();
	} );
    });

    it('should be disabled to user id if feature is not enabled', function(done) {
	var f = ff.create_feature({id: 'disabled_feature', description: 'disabled to everyone'});
	ff.save(f);
	ff.check('disabled_feature', 'user_id', function(result) {
	    result.should.equal(false);
	    ff.delete('disabled_feature');
	    done();
	});
    });

    it('should be true to user id if feature is enabled to all', function(done) {
	var f = ff.create_feature({id: 'enabled_feature', description: 'enabled to everyone', enabledTo: 'all'});
	ff.save(f);
	ff.check('enabled_feature', 'user_id', function(result) {
	    result.should.equal(true);
	    ff.delete('enabled_feature');
	    done();
	});
    });

    it('should return true if enabled to this user', function(done) {
	var f = ff.create_feature({id: 'enabled_feature', description: 'enabled to mary', enabledTo: ['mary', 'jane']});
	ff.save(f);
	ff.check('enabled_feature', 'mary', function(result) {
	    result.should.equal(true);
	    ff.delete('enabled_feature');
	    done();
	});
    });
    
    it('should return false if not enabled to this user', function(done) {
	var f = ff.create_feature({id: 'secret_feature', description: 'not enabled to john_doe', enabledTo: ['mary', 'jane']});
	ff.save(f);
	ff.check('secret_feature', 'john_doe', function(is_enabled) {
	    is_enabled.should.equal(false);
	    ff.delete('secret_feature');
	    done();
	});
    });
});

