import {Request, Response, Router} from "express";
import {updateUsers} from "./users";
import {updateLinks} from "./links";
import {updateMetadata} from "./metadata";
import {updateTexts} from "./texts";
import {TaskModel} from "../../schemas/Task";
import {auth} from "../middleware";
import {updateDescription, updateName} from "./project";
import {Project, ProjectModel} from "../../schemas/Project";
import {InstanceType} from "typegoose";

const router = Router();

export default router;

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

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  ProjectModel.findById(id).populate(['author', 'users']).then((project: InstanceType<Project> | null) => {
    if (!project) {
      return res.sendStatus(404);
    }

    return res.json(project);
  });
}

function reqCreate(req: Request, res: Response) {
  const author = req.user._id;

  if (!author || !req.body.name) {
    return res.sendStatus(400);
  }

  const project = new ProjectModel({
    author,
  });

  let ok = true;

  ok = ok && updateName(project, req.body.name);
  ok = ok && updateDescription(project, req.body.description, true);
  ok = ok && updateUsers(project, req.body.users, true);
  ok = ok && updateLinks(project, req.body.links, true);
  ok = ok && updateMetadata(project, req.body.metadata, true);
  ok = ok && updateTexts(project, req.body.texts, true);

  if (ok) {
    return project.save().then((savedProject: InstanceType<Project>) => res.json(savedProject));
  }

  return res.sendStatus(400);
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || !req.body) {
    return res.sendStatus(400);
  }

  ProjectModel.findById(id).then((project: InstanceType<Project> | null) => {
    if (!project) {
      return res.sendStatus(404);
    }

    const body = req.body;
    let changed = false;
    changed = changed || updateName(project, body.name);
    changed = changed || updateDescription(project, body.description);
    changed = changed || updateUsers(project, body.users);
    changed = changed || updateLinks(project, body.links);
    changed = changed || updateMetadata(project, body.metadata);
    changed = changed || updateTexts(project, body.texts);

    if (changed) {
      project.updated = Date.now();
      return project.save().then(() => res.json(project));
    }

    return res.sendStatus(200);
  });
}

function reqDelete(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Promise.all([
    ProjectModel.findByIdAndDelete(id),
    TaskModel.deleteMany({project: id})
  ]).then(() => {
    res.json({});
  });
}

router.get('/:id', auth, reqGet);
router.post('/', auth, reqCreate);
router.put('/:id', auth, reqUpdate);
router.delete('/:id', auth, reqDelete);
