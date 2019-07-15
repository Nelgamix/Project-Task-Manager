import {Router, Request, Response} from 'express';
import {auth} from '../middleware';
import passport from 'passport';
import {User, UserModel, UserRole} from "../../schemas/User";
import {InstanceType} from "typegoose";
import {update, updateDisplayName, updateEmail, updateImage, updateName} from "./updaters";
import {ManipulationResult, ValidationError} from "../common";
import {updateUserById} from "./manipulators";

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
  return UserModel.findByIdAndUpdate(req.user._id, {lastLogin: Date.now()}).then((user: InstanceType<User> | null) => {
    res.json(user);
  });
}

function logout(req: Request, res: Response) {
  req.logout();

  return res.sendStatus(200);
}

function me(req: Request, res: Response) {
  return res.json(req.user);
}

async function reqGet(req: Request, res: Response) {
  const users: InstanceType<User>[] = await UserModel.find();

  if (!users) {
    return res.sendStatus(500);
  }

  return res.json(users);
}

function reqGetId(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  UserModel.findById(id).then((user: InstanceType<User> | null) => {
    if (!user) {
      return res.sendStatus(404);
    }

    return res.json(user);
  });
}

function reqCreate(req: Request, res: Response) {
  if (!req.body.name || !req.body.displayName || !req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }

  User.getPasswordHash(req.body.password).then((hash: string) => {
    const user = new UserModel({
      password: hash,
      role: UserRole.User,
    });

    let error: ValidationError | undefined = update(user, req.body, false);

    if (!error) {
      return user.save().then(() => res.json(user));
    }

    return res.status(400).json(error);
  });
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  updateUserById(id, req.body, req.user).then((result: ManipulationResult) => {
    if (result.success) {
      return res.json(result.result);
    } else {
      return res.status(400).json(result.error);
    }
  });
}

function reqDelete(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  return UserModel.findByIdAndDelete(id).then(() => res.sendStatus(200));
}

router.post('/login', passport.authenticate('local'), login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

router.get('/', auth, reqGet);
router.get('/:id', auth, reqGetId);
router.post('/', reqCreate);
router.put('/:id', auth, reqUpdate);
router.delete('/:id', auth, reqDelete);
