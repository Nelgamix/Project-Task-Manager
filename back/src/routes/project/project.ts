/*const defaultPriorities = [
    {id: 'low', name: 'Low'},
    {id: 'medium', name: 'Medium'},
    {id: 'high', name: 'High'},
    {id: 'critical', name: 'Critical'},
];

const defaultDifficulties = [
    {id: 'easy', name: 'Easy'},
    {id: 'medium', name: 'Medium'},
    {id: 'hard', name: 'Hard'},
];

const defaultEstimatedTimes = [
    {id: 'short', name: 'Short (1-2 hour)'},
    {id: 'medium', name: 'Medium (~5 hours)'},
    {id: 'long', name: 'Long (10+ hours)'},
];

const defaultStates = [
    {id: 'open', name: 'Open'},
    {id: 'closed', name: 'Closed'},
    {id: 'draft', name: 'Draft'},
    {id: 'analyse', name: 'To Analyse'},
    {id: 'implement', name: 'To Implement'},
    {id: 'fix', name: 'To Fix'},
    {id: 'document', name: 'To Document'},
];

const defaultCategories = [];

const defaultTypes = [
    {id: 'bugfix', name: 'Bugfix'},
    {id: 'feature', name: 'Feature'},
];*/

import {IProject} from "../../schemas/Project";

export function updateName(project: IProject, name: string) {
  if (!name) {
    return false;
  }

  project.name = name;

  return true;
}

export function updateDescription(project: IProject, description: string) {
  if (!description) {
    return false;
  }

  project.description = description;

  return true;
}
