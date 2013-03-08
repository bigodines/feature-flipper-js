/*
  Feature flipper admin tool

The aim of this app is to provide a way to manage your features throught feature flipper. Of course you are not required to use this in order to use the library itself!!!
*/

/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    redis = require('redis');
var app = module.exports = express.createServer();
// Configuration

var check_login = function(req, res, next) {
    if (req.session && req.session.login) {
        next();
        return;
    }
    res.render('login', { error: 'Please login first' } );
}


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'my very secret key', redis : redis }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// API method calls (read the tests to know how to use them)
app.get('/v1/create', api.create);
app.get('/v1/check', api.check);
app.post('/v1/enableTo', api.enableTo);
app.post('/v1/disableTo', api.disableTo);
app.post('/v1/remove', api.remove);

// Sample app Routes
app.post('/', routes.login);
app.get('/', check_login, routes.index);
app.get('/create', /*check_login,*/ routes.createFeature);
 


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
