const User = require('../model/users');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register')
}

module.exports.Register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registerd = await User.register(user, password);
        req.login(registerd, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to YelpCamp!")
            res.redirect('/campGround')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campGround';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!')
    res.redirect('/campGround')
}