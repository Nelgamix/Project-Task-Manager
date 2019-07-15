import {InstanceType} from "typegoose";
import {Project} from "../../schemas/Project";

const defaultName = '';
const defaultDescription = '';

export function updateName(
    project: InstanceType<Project>,
    name: string,
    allowDefault = false
) {
  if (!name) {
    return false;
  } else if (allowDefault && defaultName) {
    project.name = defaultName;
    return false;
  }

  project.name = name;

  return true;
}

export function updateDescription(
    project: InstanceType<Project>,
    description: string,
    allowDefault = false
) {
  if (!description) {
    return false;
  } else if (allowDefault && defaultDescription) {
    project.description = defaultDescription;
    return false;
  }

  project.description = description;

  return true;
}
