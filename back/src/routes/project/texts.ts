import {InstanceType} from "typegoose";
import {Project, ProjectText} from "../../schemas/Project";

export function updateTexts(
    project: InstanceType<Project>,
    texts: ProjectText[],
    defaultValue?: ProjectText[]
) {
  if (!texts) {
    return false;
  } else if (defaultValue) {
    project.texts = defaultValue;
    return false;
  }

  project.texts = texts;

  return true;
}
