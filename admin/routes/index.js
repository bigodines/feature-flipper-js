/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login');
};

exports.login = function(req, res) {
    var user = req.body.username;
    var password = req.body.userpass;

    console.log(user,password);


    if (user === 'admin' && password === 'featureflipper') {
        console.log('eeee!!');
        res.render('index');
    }
    else {
        console.log('try again');
        res.render('login', {error: 'Invalid Login'});
    }
};
