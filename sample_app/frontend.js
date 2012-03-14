/* This is a sample application that ilustrates how to work with feature flipper 

it requires ExpressJS to run. (http://expressjs.com)
*/

var express = require('express');
var app = express.createServer();
var feature_flipper = require('../feature_flipper');

app.configure(function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/:user?', function(req, res) {
    res.send('hello '+ req.params.user);

});




app.listen(3000);
