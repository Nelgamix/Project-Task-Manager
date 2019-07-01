import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import {IUser, User} from './schemas/User';
// Routes
import project from './routes/project/routes';
import task from './routes/task/routes';
import user from './routes/user/routes';

// Constant
const PORT = 3000;
const HOST = 'localhost';
const BASE = 'project-task-manager';
const SECRET = 'project-task-manager-project-back';

const app = express();

const MongoStore = connectMongo(session);

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
        User.findOne({name: username}, (err: any, user: IUser) => {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          (user as any).validatePassword(password, (res: any) => {
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
    secret: SECRET,
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

  router.use('/user', user);
  router.use('/project', project);
  router.use('/task', task);

  app.use('/api', router);

  app.listen(PORT, 'localhost', () => console.log('App is running'));
});
