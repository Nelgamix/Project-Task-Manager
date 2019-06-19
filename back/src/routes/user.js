const express = require('express');
const passport = require('passport');
const User = require('../schemas/User');
const Project = require('../schemas/Project');
const middleware = require('./middleware');
const router = express.Router();

User.find({name: 'admin'}).then(users => {
    if (!users || users.length === 0) {
        User.getPasswordHash('admin', hash => {
            new User({
                name: 'admin',
                displayName: 'admin',
                email: '',
                image: '',
                role: 'admin',
                password: hash,
            }).save();
            console.log('Admin account created.');
        });
    }
});

function login(req, res) {
    User.findByIdAndUpdate(req.user._id, {lastLogin: Date.now()}).then(() => {
        User.findById(req.user.id, {password: 0}).then(doc => res.json(doc));
    });
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function me(req, res) {
    res.json(req.user);
}

function reqGet(req, res) {
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

function reqCreate(req, res) {
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

function reqUpdate(req, res) {
    const name = req.params.name;
    // Fields changeable
    const displayName = req.body.displayName;
    const email = req.body.email;
    const image = req.body.image;

    if (!name) {
        return res.sendStatus(400);
    }

    User.findOne({name}, {password: 0}).then(user => {
        if (!user) {
            return res.sendStatus(404);
        }

        if (displayName) user.displayName = displayName;
        if (email) user.email = email;
        if (image) user.image = image;

        user.save().then(() => res.json(user));
    });
}

function reqDelete(req, res) {
    const name = req.params.name;

    if (!name) {
        return res.sendStatus(400);
    }

    User.deleteOne({name}).then(() => res.sendStatus(200));
}

router.post('/login', passport.authenticate('local'), login);
router.post('/logout', middleware.auth, logout);
router.get('/me', middleware.auth, me);

router.get('/:name', middleware.auth, reqGet);
router.post('/', reqCreate);
router.put('/:name', middleware.auth, reqUpdate);
router.delete('/:name', middleware.auth, reqDelete);

module.exports = router;
