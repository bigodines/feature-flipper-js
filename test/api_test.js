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
                feature_id : 'first',
                user_id: 'john'
            }
        };
        var res = {
            status : function(code) {
                code.should.equal(200);
            },
            send : function(result) {
                result.should.equal('{"id":"first","message":"success"}');
                done();
            }
        };
        api.enableTo(req, res);
    });
});
