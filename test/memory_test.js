var should = require('should');

describe('In-memory storage tests', function () {
    it('should set/get/delete just like the other storage engines', function(done) {
        var storage = require('../storage/ff_memory')();
        run_storage_tests(storage, done);
    });
});

function run_storage_tests(storage, done) {
    var serialized_object = "{ 'foo' : 'bar', 'john' : 'doe' }";
    var delete_cb = function() {
        storage.del('id', function() {
            storage.get('id', function(err, data) {
                should.equal(null, data);
                done();
            })
        })
    };
    var get_cb = function(e, val) {
        storage.get('id', function (e, data) {
            should.equal(null, e);
            should.equal(serialized_object, data);
            delete_cb();
        });
    };
    storage.set('id', serialized_object, function(err, val) {
        should.equal(null, err);
        get_cb();
    });
}
