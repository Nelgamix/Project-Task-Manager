const express = require('express');
const passport = require('passport');
const User = require('../schemas/User');
const Project = require('../schemas/Project');
const middleware = require('./middleware');
const router = express.Router();

function login(req, res) {
    User.findByIdAndUpdate(req.user._id, {lastLogin: Date.now()}).then(() => {
        User.findById(req.user.id, {_id: 0, __v: 0, password: 0}).then(doc => res.json(doc));
    });
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function me(req, res) {
    res.json(req.user);
}

function get(req, res) {
    const name = req.params.name;

    if (!name) {
        return res.sendStatus(400);
    }

    User.findOne({name}, {password: 0}).then(user => {
        if (!user) {
            return res.sendStatus(404);
        }

        Project.find({userId: user.id}).then(projects => {
            user._doc.projects = projects;
            res.json(user);
        });
    });
}

function create(req, res) {
    const name = req.body.name;
    const displayName = req.body.displayName || name;
    const email = req.body.email;
    const role = 'user';
    const password = req.body.password;

    if (!name || !displayName || !email || !password) {
        return res.sendStatus(400);
    }

    User.getPasswordHash(password, hash => {
        const user = new User({
            name,
            displayName,
            email,
            role,
            password: hash,
        });

        user.save().then(() => res.json(user));
    });
}

function update(req, res) {
    const name = req.params.name;
    // Fields changeable
    const displayName = req.body.displayName;
    const email = req.body.email;

    if (!name) {
        return res.sendStatus(400);
    }

    User.findOne({name}, {password: 0}).then(user => {
        if (!user) {
            return res.sendStatus(404);
        }

        if (displayName) user.displayName = displayName;
        if (email) user.email = email;

        user.save().then(() => res.json(user));
    });
}

function fDelete(req, res) {
    const name = req.params.name;

    if (!name) {
        return res.sendStatus(400);
    }

    User.deleteOne({name}).then(() => res.json({}));
}

router.post('/login', passport.authenticate('local'), login);
router.post('/logout', middleware.auth, logout);
router.get('/me', middleware.auth, me);

router.get('/:name', middleware.auth, get);
router.post('/', create);
router.put('/:name', middleware.auth, update);
router.delete('/:name', middleware.auth, fDelete);

module.exports = router;
