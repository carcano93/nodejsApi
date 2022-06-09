const passport = require('passport');
const mongose = require('mongoose');
const User = mongose.model('Users');

const register = (req, res) => {
    if (!req.body.name || !req.body.password) {
        return res
            .status(400)
            .json({ 'message': 'All fields required' });
    }
    const user = new User();
    user.name = req.body.name.replace(/![A-z]/g, '');
    user.setPassword(req.body.password);
 
    user.save((err) => {
        if (err) {
            return res
                .status(404)
                .json({ err: err.message });
        } else {
            const token = user.generateJWT();
            res
                .status(200)
                .json({ token })
        }
    })
}

const login = (req, res) => {
    if (!req.body.name || !req.body.password) {
        return res
            .status(400)
            .json({ 'message': 'All fields required' });
    }
    passport.authenticate('local', (err, user, info) => {
        let token;
        if (err) {
            return res
                .status(404)
                .json({ err: err.message });
        }
        if (!user) {
            return res
                .status(401)
                .json(info);
        } else {
            token = user.generateJWT();
            res
                .status(200)
                .json({ token });
        }
    })(req, res);
}

module.exports = {

    register,
    login
}