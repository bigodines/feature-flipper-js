var should = require('should'),
    flipper = require('../feature_flipper'),
    api = require('../admin/routes/api').api;


describe('API Test', function() {
    it('should be possible to create a new feature trought API', function(done) {
        var req = {};
        var res = {
            send : function(result) {
                result.should.equal('{"hello":"world"}');
                done();
            }
        };
        api.create(req, res);
    });
});
