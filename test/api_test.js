var should = require('should'),
    flipper = require('../feature_flipper'),
    ff_redis = require('../storage/ff_redis')(),
    api = require('../admin/routes/api');


describe('API Test - Happy path', function() {
    beforeEach(function() {
        var ff = flipper(ff_redis);
        ff.save(ff.create_feature({id : 'first', description : 'le feature'}));
    }),

    afterEach(function(done) {
        var redis = require('redis').createClient();
        redis.keys('feature:*', function(err, data) {
            redis.mget(data, function(err, features) {
                var total = features.length;
                for (var i = total; i > 0; i--) {
                    var feature = JSON.parse(features[i-1]);
                    redis.del(feature.id, function() {
//                        console.log(feature.id);
                    });
                }
                done();
            });
        });
    });

    it('should be possible to create a new feature trought API', function(done) {
        var req = { 
            body : {
                id : 'seccond',
                description: 'first feature inserted via api'
            }
        };
        var res = {
            send : function(result) {
                result.should.equal('{"id":"seccond","description":"first feature inserted via api"}');
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
                result.should.equal('{"id":"first","user":"john","status":"disabled"}');
                done();
            }
        };
        api.check(req, res);
    });
});

describe('API Test - Not so happy paths', function() {
    beforeEach(function() {
        var ff = flipper(ff_redis);
        ff.save(ff.create_feature({id : 'first', description : 'le feature'}));
    }),

    afterEach(function(done) {
        var redis = require('redis').createClient();
        redis.keys('feature:*', function(err, data) {
            redis.mget(data, function(err, features) {
                var total = features.length;
                for (var i = total; i > 0; i--) {
                    var feature = JSON.parse(features[i-1]);
                    redis.del(feature.id, function() {
//                        console.log(feature.id);
                    });
                }
                done();
            });
        });
    });

    it('should not allow creation of features without required fields', function(done) {
        var req = { 
            body : {
                id : 'buggy_with_no_description',
            }
        };
        var res = {
            status : function(code) {
                code.should.equal(400);
                done();
            },
            send : function(result) {
                result.should.equal('{"error":"400","message":"Invalid input"}');
            }
        };
        api.create(req, res);
    });

    it('should return error if trying to enable a feature that does not exist', function(done) {
        var req = { 
            body : {
                feature_id : 'i_dont_exist',
                user_id : 'me neither'
            }
        };
        var res = {
            status : function(code) {
                code.should.equal(400);
            },
            send : function(result) {
                result.should.equal('{"error":"400","message":"Invalid input: Feature or user does not exist"}');
                done();
            }
        };
        api.enableTo(req, res);
        
    });
});
