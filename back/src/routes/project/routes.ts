import {Request, Response, Router} from "express";
import {IProject, Project} from "../../schemas/Project";
import {updateUsers} from "./users";
import {updateLinks} from "./links";
import {updateMetadata} from "./metadata";
import {updateTexts} from "./texts";
import {Task} from "../../schemas/Task";
import {auth} from "../middleware";
import {updateDescription, updateName} from "./project";

const router = Router();

export default router;

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

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Project.findById(id).populate(['author', 'users']).then((project: IProject | null) => {
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

  project.save().then((savedProject: IProject) => res.json(savedProject));
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || !req.body) {
    return res.sendStatus(400);
  }

  Project.findById(id).then((project: IProject | null) => {
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
