var should = require('should'),
    storage = require('../storage/ff_redis');

/* in order to run these tests, you must have redis up and running in your machine*/
describe('Redis Storage', function() {

    describe('Basic Stuff', function() {
	it('should be able to take a json and save', function(done) {
	    var serialized_object = "{ 'foo' : 'bar', 'john' : 'doe' }",
	        result = storage().set('id', serialized_object, done);

	    result.should.equal(true);
	});
	
	it('should be able to retrieve', function(done) {
	    var serialized_object = "{ 'foo' : 'bar', 'john' : 'doe' }";
 	    storage().get('id', function(err, data) {
		data.should.eql(serialized_object);
		done();
	    });
	});

    });

});
