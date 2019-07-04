import {remove} from 'lodash';
import {diff} from "../common";
import {InstanceType} from "typegoose";
import {Project, ProjectUser} from "../../schemas/Project";

export function updateUser(source: ProjectUser, update: ProjectUser) {
  if (update.right) {
    source.right = update.right;
  }
}

export function updateUsers(
    project: InstanceType<Project>,
    users: ProjectUser[],
    defaultValue?: ProjectUser[]
) {
  if (!users) {
    return false;
  } else if (defaultValue) {
    project.users = defaultValue;
    return false;
  }

  if (!project.users) {
    project.users = [];
  }

  const [usersToCreate, usersToUpdate, usersToDelete] = diff(
      project.users,
      users,
      (arr, elem) => arr.findIndex(e => e.user == elem.user),
      (model: ProjectUser, update: ProjectUser) => {
        return model.right !== update.right;
      }
  );

  for (const user of usersToCreate) {
    project.users.push(user);
  }

  for (const user of usersToDelete) {
    remove(project.users, u => u._id == user._id);
  }

  for (const user of usersToUpdate) {
    const us = project.users.find(u => u._id == user._id);

    if (us) {
      updateUser(us, user);
    }
  }

  return usersToCreate.length > 0
      || usersToDelete.length > 0
      || usersToUpdate.length > 0;
}
