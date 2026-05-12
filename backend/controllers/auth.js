const User = require('../model/users');
const { signToken } = require('../helpers/jwt');

const authResponse = (user, message) => ({
    user,
    token: signToken({ id: user._id, username: user.username }),
    message
});

module.exports.Register = async (req, res, next) => {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.trim();
        const { password } = req.body;

        if (!username || username.length < 3 || username.length > 30) {
            return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
        }

        if (!email || email.length > 120 || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = new User({ email, username });
        const registerd = await User.register(user, password);
        res.json(authResponse(registerd, "Welcome to YelpCamp!"))
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

module.exports.login = (req, res) => {
    res.json(authResponse(req.user, 'Welcome back!'));
}

module.exports.currentUser = (req, res) => {
    res.json({ user: req.user || null });
}
