const authAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }

    res.sendStatus(401);
}

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(401);
}

module.exports = {
    auth,
    authAdmin,
};
