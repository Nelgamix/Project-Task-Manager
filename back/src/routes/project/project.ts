import {InstanceType} from "typegoose";
import {Project} from "../../schemas/Project";

export function updateName(
    project: InstanceType<Project>,
    name: string,
    defaultValue?: string
) {
  if (!name) {
    return false;
  } else if (defaultValue) {
    project.name = defaultValue;
    return false;
  }

  project.name = name;

  return true;
}

export function updateDescription(
    project: InstanceType<Project>,
    description: string,
    defaultValue?: string
) {
  if (!description) {
    return false;
  } else if (defaultValue) {
    project.description = defaultValue;
    return false;
  }

  project.description = description;

  return true;
}
