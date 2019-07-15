import {InstanceType} from "typegoose";
import {Project, ProjectLink} from "../../schemas/Project";

const defaultLinks: any[] = [];

export function updateLinks(
    project: InstanceType<Project>,
    links: ProjectLink[],
    allowDefault = false
) {
  if (!links) {
    return false;
  } else if (allowDefault && defaultLinks) {
    project.links = defaultLinks;
    return false;
  }

  project.links = links;

  return true;
}
