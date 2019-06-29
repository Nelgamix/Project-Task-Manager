import {IProject} from "../../schemas/Project";
import {ILink} from "../../schemas/common";

export function updateLinks(project: IProject, links: ILink[]) {
  if (!links) {
    return false;
  }

  project.links = links;

  return true;
}
