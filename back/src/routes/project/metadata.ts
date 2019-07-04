import {InstanceType} from "typegoose";
import {Project, ProjectMetadata} from "../../schemas/Project";

export function updateMetadata(
    project: InstanceType<Project>,
    metadata: ProjectMetadata[],
    defaultValue?: ProjectMetadata[]
) {
  if (!metadata) {
    return false;
  } else if (defaultValue) {
    project.metadata = defaultValue;
    return false;
  }

  project.metadata = metadata;

  return true;
}
