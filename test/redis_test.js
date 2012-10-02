var should = require('should'),
    storage = require('../storage/ff_redis')(6379, 'localhost');

/* in order to run these tests, you must have redis up and running in your machine*/
describe('Redis Storage', function() {

    describe('Basic Stuff', function() {
        var serialized_object = "{ 'foo' : 'bar', 'john' : 'doe' }";
        it('should be able to take a JSON and save', function(done) {
            storage.set('id', serialized_object, function (err, data) {
                should.equal(err, null);
                done();
            });

        });
        
        it('should be able to retrieve', function(done) {
            var serialized_object = "{ 'foo' : 'bar', 'john' : 'doe' }";
            storage.get('id', function(err, data) {
                data.should.eql(serialized_object);
                done();
            });
        });

        it('should be able to delete', function(done) {
            storage.set('foo', 'foo_value');
            storage.del('foo', function (err) {
                should.equal(err, null);
                storage.get('foo', function(err, data) {
                    should.equal(data, null);
                    done();
                });
            });
        });

    });

});
