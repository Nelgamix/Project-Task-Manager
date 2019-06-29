import {Router, Request, Response} from 'express';
import {Project, IProject} from '../../schemas/Project';
import {Task} from '../../schemas/Task';
import {auth} from '../middleware';
import {updateUsers} from "./users";
import {updateMetadata} from "./metadata";
import {updateLinks} from "./links";

const router = Router();

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

const defaultMetadata = [
  {
    id: 'state',
    name: 'State',
    description: 'State of the ticket',
    values: [
      {
        id: 'open',
        name: 'Open',
        value: '',
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        value: '',
      },
      {
        id: 'closed',
        name: 'Closed',
        value: '',
      },
    ]
  },
];

const defaultTexts = [
  {
    id: 'todo',
    name: 'Todo',
    description: '',
    skeleton: '',
  }
];

function updateName(project: IProject, name: string) {
  if (!name) {
    return false;
  }

  project.name = name;

  return true;
}

function updateDescription(project: IProject, description: string) {
  if (!description) {
    return false;
  }

  project.description = description;

  return true;
}

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Project.findById(id).populate(['author', 'users']).then(project => {
    if (!project) {
      return res.sendStatus(404);
    }

    return res.json(project);
  });

  /*Project.findById(id).then(project => {
      return Promise.all([
          User.findById(project.userId),
          Task.find({projectId: id})
      ]).then((values) => {
          project._doc.user = values[0];
          project._doc.tasks = values[1];
          return res.json(project);
      });
  });*/
}

function reqCreate(req: Request, res: Response) {
  const author = req.user._id;
  const name = req.body.name;
  const description = req.body.description || '';
  const links = req.body.links || [];
  const users: any[] = [];
  const metadata = defaultMetadata;
  const texts = defaultTexts;

  if (!author || !name) {
    return res.sendStatus(400);
  }

  const project = new Project({
    author,
    name,
    description,
    links,
    users,
    metadata,
    texts,
  });

  project.save().then(() => res.json(project));
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || !req.body) {
    return res.sendStatus(400);
  }

  Project.findById(id).then(project => {
    if (!project) {
      return res.sendStatus(404);
    }

    const body = req.body;
    let changed = false;
    changed = changed || updateName(project, body.name);
    changed = changed || updateDescription(project, body.name);
    changed = changed || updateUsers(project, body.name);
    changed = changed || updateLinks(project, body.name);
    changed = changed || updateMetadata(project, body.name);

    if (changed) {
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
    Project.findByIdAndDelete(id),
    Task.deleteMany({project: id})
  ]).then(() => {
    res.json({});
  });
}

router.get('/:id', auth, reqGet);
router.post('/', auth, reqCreate);
router.put('/:id', auth, reqUpdate);
router.delete('/:id', auth, reqDelete);

module.exports = router;
