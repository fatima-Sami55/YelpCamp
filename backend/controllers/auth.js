const User = require('../model/users');

module.exports.renderRegister = (req, res) => {
    res.json({})
}

module.exports.Register = async (req, res, next) => {
    try {
        
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registerd = await User.register(user, password);
        req.login(registerd, err => {
            if (err) return next(err);
            res.json({ user: registerd, message: "Welcome to YelpCamp!" })
        })
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

module.exports.renderLogin = (req, res) => {
    res.json({})
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campGround';
    delete req.session.returnTo;
    res.json({ user: req.user, message: 'Welcome back!' });
}

module.exports.currentUser = (req, res) => {
    res.json({ user: req.user || null });
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: 'Successfully Logged Out!' })
    });
}
