import {User, UserModel, UserRole} from "../../schemas/User";
import {InstanceType} from "typegoose";
import {
  createManipulationResultFail,
  createManipulationResultSuccess,
  ManipulationErrorType,
  ManipulationResult,
  ValidationError
} from "../common";
import {update} from "./updaters";

export function createUser(user: User, updateObject: any, requester?: User): Promise<ManipulationResult> {
  return new Promise<ManipulationResult>((resolve, reject) => {
    User.getPasswordHash(updateObject.password).then((hash: string) => {
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
  });
}

export function updateUserById(id: number, updateObject: any, requester?: User): Promise<ManipulationResult> {
  return new Promise<ManipulationResult>((resolve, reject) => {
    UserModel.findById(id).then((user: InstanceType<User> | null) => {
      if (!user) {
        return resolve(createManipulationResultFail({
          type: ManipulationErrorType.NotFound,
        }));
      }

      let error: ValidationError | undefined = update(user, updateObject, true);

      if (!error) {
        return user.save().then(() => {
          return resolve(createManipulationResultSuccess(user));
        });
      }

      return resolve(createManipulationResultFail({
        type: ManipulationErrorType.NotValidated,
        error: error.error,
      }));
    });
  });
}
