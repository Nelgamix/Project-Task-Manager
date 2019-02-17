const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./src/schemas/User');

const PORT = 3001;
const app = express();

// Config Mongoose
mongoose.connect(`mongodb://localhost/project-task-manager`, { useNewUrlParser: true }).then(() => {
    console.log('MongoDB connected');

    // Passport config
    passport.use(
        new LocalStrategy({
            usernameField: 'name',
            passwordField: 'password',
        }, (username, password, done) => {
            User.findOne({name: username}, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                user.validatePassword(password, res => {
                    if (!res) {
                        done(null, false, { message: 'Incorrect password.' });
                    } else {
                        done(null, user);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user._id);
    });

    passport.deserializeUser((id, cb) => {
        User.findById(id).then(user => {
            cb(null, user);
        }, err => {
            cb(err);
        });
    });

    const sessionMiddleware = session({
        secret: 'project-task-manager-project-back',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    });

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());

    const router = express.Router();

    router.use('/user', require('./src/routes/user'));
    router.use('/project', require('./src/routes/project'));
    router.use('/task', require('./src/routes/task'));

    app.use('/api', router);

    app.listen(PORT, 'localhost', () => console.log('App is running'));
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
