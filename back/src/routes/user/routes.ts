import {Router, Request, Response} from 'express';
import {auth} from '../middleware';
import passport from 'passport';
import {User, UserModel, UserRole} from "../../schemas/User";
import {InstanceType} from "typegoose";

const router = Router();

export default router;

UserModel.find({name: 'admin'}).then((users: InstanceType<User>[]) => {
  if (!users || users.length === 0) {
    User.getPasswordHash('admin').then((hash: string) => {
      new UserModel({
        name: 'admin',
        displayName: 'admin',
        email: '',
        image: '',
        role: UserRole.Admin,
        password: hash,
      }).save();

      console.log('Admin account created.');
    });
  }
});

function login(req: Request, res: Response) {
  UserModel.findByIdAndUpdate(req.user._id, {lastLogin: Date.now()}).then((user: InstanceType<User> | null) => {
    res.json(user);
    // User.findById(req.user.id, {password: 0}).then(doc => res.json(doc));
  });
}

function logout(req: Request, res: Response) {
  req.logout();

  return res.sendStatus(200);
}

function me(req: Request, res: Response) {
  return res.json(req.user);
}

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  UserModel.findById(id, {password: 0}).then((user: InstanceType<User> | null) => {
    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);

    /*Project.find({userId: user.id}).then(projects => {
      user._doc.projects = projects;
      res.json(user);
    });*/
  });
}

function reqCreate(req: Request, res: Response) {
  const name = req.body.name;
  const displayName = req.body.displayName || name;
  const email = req.body.email;
  const role = 'user';
  const password = req.body.password;

  if (!name || !displayName || !email || !password) {
    return res.sendStatus(400);
  }

  User.getPasswordHash(password).then((hash: string) => {
    const user = new UserModel({
      name,
      displayName,
      email,
      role,
      password: hash,
    });

    user.save().then(() => res.json(user));
  });
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;
  // Fields changeable
  const displayName = req.body.displayName;
  const email = req.body.email;
  const image = req.body.image;

  if (!id) {
    return res.sendStatus(400);
  }

  UserModel.findById(id).then((user: InstanceType<User> | null) => {
    if (!user) {
      return res.sendStatus(404);
    }

    if (displayName) user.displayName = displayName;
    if (email) user.email = email;
    if (image) user.image = image;

    user.save().then(() => res.json(user));
  });
}

function reqDelete(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  UserModel.findByIdAndDelete(id).then(() => res.sendStatus(200));
}

router.post('/login', passport.authenticate('local'), login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

router.get('/:name', auth, reqGet);
router.post('/', reqCreate);
router.put('/:name', auth, reqUpdate);
router.delete('/:name', auth, reqDelete);
