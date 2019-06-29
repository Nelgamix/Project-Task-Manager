import {remove} from 'lodash';
import {diff} from "../common";
import {IProject, IProjectUser} from "../../schemas/Project";

export function updateUser(source: IProjectUser, update: IProjectUser) {
  if (update.right) {
    source.right = update.right;
  }
}

export function updateUsers(project: IProject, users: IProjectUser[]) {
  if (!users) {
    return false;
  }

  const [usersToCreate, usersToUpdate, usersToDelete] = diff(
      project.users,
      users,
      (arr, elem) => arr.findIndex(e => e.user == elem.user),
      (model: IProjectUser, update: IProjectUser) => {
        return model.right !== update.right;
      }
  );

  for (const user of usersToCreate) {
    project.users.push(user);
  }

  for (const user of usersToDelete) {
    remove(project.users, u => u.id == user.id);
  }

  for (const user of usersToUpdate) {
    const us = project.users.find(u => u.id == user.id);

    if (us) {
      updateUser(us, user);
    }
  }

  return usersToCreate.length > 0
      || usersToDelete.length > 0
      || usersToUpdate.length > 0;
}
