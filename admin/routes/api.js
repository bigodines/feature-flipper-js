//var ff = require('feature_flipper');


exports.api = (api = function() {


    return {
        create : function(req, res) {
            res.send(JSON.stringify({ "hello" : "world" }));
        }
    }

})();

