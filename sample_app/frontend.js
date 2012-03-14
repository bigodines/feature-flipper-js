/* This is a sample application that ilustrates how to work with feature flipper 

it requires ExpressJS to run. (http://expressjs.com)
*/

var express = require('express');
var app = express.createServer(
    express.logger(),
    express.bodyParser()
    
);
var feature_flipper = require('../feature_flipper');

app.configure(function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);
});


app.all('/:user?', function(req, res, next) {
    var user = req.params.user;
    if (user) {
	res.send('hello '+ user);
    } else {
	next();
    }

});

app.get('/', function( req, res) {
    res.send('this is a sample application using express and feature_flipper. Please make a request to /<user> where <user> is \'mary\', \'john\' or \'admin\'');
});




app.listen(3000);
