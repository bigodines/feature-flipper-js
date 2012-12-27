var should = require('should'),
    flipper = require('../feature_flipper'),
    api = require('../admin/routes/api').api;


describe('API Test', function() {
    it('should be possible to create a new feature trought API', function(done) {
        var req = { 
            body : {
                id : 'first',
                description: 'first feature inserted via api'
            }
        };
        var res = {
            send : function(result) {
                result.should.equal('{"id":"first","description":"first feature inserted via api"}');
                done();
            }
        };
        api.create(req, res);
    });

    it('should be possible to enable a feature throught API', function(done) {
        var req = { 
            body : {
                id : 'first',
                description: 'first feature inserted via api'
            }
        };
        var res = {
            send : function(result) {
                result.should.equal('{"id":"first","description":"first feature inserted via api"}');
                done();
            }
        };
        api.create(req, res);
    });
});
