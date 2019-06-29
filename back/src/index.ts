const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./src/schemas/User');

const PORT = 3000;
const HOST = 'localhost';
const BASE = 'project-task-manager';

const app = express();

// TODO: configure types

// Config Mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb://${HOST}/${BASE}`, { useNewUrlParser: true }).then(() => {
  console.log('MongoDB connected');

  // Passport config
  passport.use(
      new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
      }, (username: string, password: string, done: (err: any, obj?: any, errObj?: any) => void) => {
        User.findOne({name: username}, (err: any, user: any) => {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          user.validatePassword(password, (res: any) => {
            if (!res) {
              done(null, false, { message: 'Incorrect password.' });
            } else {
              done(null, user);
            }
          });
        });
      })
  );

  passport.serializeUser((user: any, cb: (err: any, data: any) => void) => {
    cb(null, user._id);
  });

  passport.deserializeUser((id: string, cb: (err: any, data?: any) => void) => {
    User.findById(id).then((user: any) => {
      cb(null, user);
    }, (err: any) => {
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
