var check_login = function(req, res) {
    if (!req.session || !req.session.login) {
        res.render('login');
        return false;
    }
    return true;

}

/*
 * GET home page.
 */

exports.index = function(req, res){
    if (check_login(req, res)) { 
        res.render('index');
    }
};

exports.login = function(req, res) {
    var user = req.body.username;
    var password = req.body.userpass;

    if (user === 'admin' && password === 'featureflipper') {
        req.session.login = 'admin';
        res.render('index');
    }
    else {
        res.render('login', {error: 'Invalid Login'});
    }
};

