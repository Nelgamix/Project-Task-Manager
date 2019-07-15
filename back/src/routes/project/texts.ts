import {InstanceType} from "typegoose";
import {Project, ProjectText} from "../../schemas/Project";

const defaultTexts: any[] = [
  {
    name: 'Todo',
    description: '',
    skeleton: '',
  }
];

export function updateTexts(
    project: InstanceType<Project>,
    texts: ProjectText[],
    allowDefault = false
) {
  if (!texts) {
    return false;
  } else if (allowDefault && defaultTexts) {
    project.texts = defaultTexts;
    return false;
  }

  project.texts = texts;

  return true;
}
