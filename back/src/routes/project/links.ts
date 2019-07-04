import {InstanceType} from "typegoose";
import {Project, ProjectLink} from "../../schemas/Project";

export function updateLinks(
    project: InstanceType<Project>,
    links: ProjectLink[],
    defaultValue?: ProjectLink[]
) {
  if (!links) {
    return false;
  } else if (defaultValue) {
    project.links = defaultValue;
    return false;
  }

  project.links = links;

  return true;
}
