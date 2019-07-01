import {IProject, IProjectText} from "../../schemas/Project";

export function updateTexts(project: IProject, texts: IProjectText[]) {
  if (!texts) {
    return false;
  }

  project.texts = texts;

  return true;
}
