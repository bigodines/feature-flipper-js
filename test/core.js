var redis = require('redis'),
    should = require('should'),
    client = redis.createClient();

/* simple test to check if redis is running and working as expected */
describe('redis is working', function () {
    var key_to_set = 'cat',
        value_to_set = 'margarida';
    
    describe('#set()', function() {
	it('should set without errors', function(done) {
	    client.set(key_to_set, value_to_set, done);
	});
    });

    describe('#get()', function() {
	it('should get the proper value', function(done) {
	    client.get(key_to_set, function(err, data) {
		should.not.exist(err);
		data.should.equal(value_to_set);
		done();
	    });
	});
    });
});
