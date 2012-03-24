/* This is a sample application that ilustrates how to work with feature flipper 

Hopefully it will get you started.

::::DEPENDENCY:::
it requires ExpressJS to run. (http://expressjs.com)


::::DISCLAIMER::::
sorry for the dirty code. I promise it will get better, but I want to work on more features for the library first.
*/

var express = require('express');
var app = express.createServer(
    express.logger(),
    express.bodyParser()
    
);
var ff_redis = require('../storage/ff_redis')();
var feature_flipper = require('../feature_flipper');


ff = feature_flipper(ff_redis);
/*creating some sample features*/
ff.save(ff.create_feature({id: 'custom_welcome', description: 'custom welcome message', enabledTo:['john', 'admin']}));
ff.save(ff.create_feature({id: 'footer', description: 'site footer', enabledTo: 'all'}));

app.configure(function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);

});


app.all('/:user?', function(req, res, next) {
    var user = req.params.user;
    if (user) {
	render_site(req, res, user);
    } else {
	next();
    }

});

app.get('/', function( req, res) {
    res.send('this is a sample application using express and feature_flipper. Please make a request to /&lt;user&gt; where &lt;user&gt; is \'mary\', \'john\' or \'admin\'');
});


render_site = function(req, res, user) {
    var body;
    render_header(res); /* this feature is 'stable' and not flipped!*/
    ff.check('custom_welcome', user, function(is_enabled) {  is_enabled ? render_custom_header(res, user) : render_default_header(res) });
    ff.check('footer', user, function(is_enabled) { is_enabled ? render_footer(res) : render_old_footer(res) });
};




render_header = function(res) { res.write( "<h1>Feature flipper dummy app (nothing huge to see here)</h1>") };
/* template snippets that are flipped according to the user */
render_custom_header = function(res, user) { res.write( "<h1>Hello "+user+", this is your custom header</h1>") };

render_default_header = function(res) { console.log('called default_header'); res.write( "<strong>hello, you are seeing the default header as you user is not flagged to see the customized welcome</strong>") };

render_footer = function(res) { res.write( "<p>This is a sample page to show feature_flipper working</p>"); res.end('-- done --'); };

render_old_footer = function(res) { res.write( 'this should not be displayed. something went wrong'); res.end(' :( done ');  };



app.listen(3000);
