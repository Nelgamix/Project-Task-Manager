import {IProject, IProjectMetadata} from "../../schemas/Project";

export function updateMetadata(project: IProject, metadata: IProjectMetadata[]) {
  if (!metadata) {
    return false;
  }

  project.metadata = metadata;

  return true;
}
