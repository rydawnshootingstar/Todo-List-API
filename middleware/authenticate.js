var {User} = require('../models/user');

//auth middleware
var authenticate = (req,res,next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user)=> {
        if (!user){
            //runs error case below
            return Promise.reject();
        }
        //modify the request parameters
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=> {
        //authentication required status
        res.status(401).send();
    });
};

module.exports = {authenticate};