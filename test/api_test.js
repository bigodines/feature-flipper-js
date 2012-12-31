var should = require('should'),
    flipper = require('../feature_flipper'),
    api = require('../admin/routes/api');


describe('API Test - Happy path', function() {
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
                result.should.equal('{"id":"first","action":"enable","message":"success"}');
                done();
            }
        };
        api.enableTo(req, res);
    });

    it('should be possible to disable a feature throught API', function(done) {
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
                result.should.equal('{"id":"first","action":"disable","message":"success"}');
                done();
            }
        };
        api.disableTo(req, res);
    });

    it('should be possible to delete a feature using the API', function(done) {
        var req = { 
            body : {
                feature_id : 'first',
            }
        };
        var res = {
            status : function(code) {
                code.should.equal(200);
            },
            send : function(result) {
                result.should.equal('{"id":"first","action":"remove","message":"success"}');
                done();
            }
        };
        api.remove(req, res);
    });

    it('should be possible to check if a feature is enabled or not for a given user throught the API', function(done) {
        done();
    });
});
