import {Router, Request, Response} from 'express';
import {ITask, Task} from '../../schemas/Task';
import {auth} from '../middleware';

const router = Router();

export default router;

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Task.findById(id).then((task: ITask | null) => {
    if (!task) {
      return res.sendStatus(404);
    }

    return res.json(task);

    /*return Promise.all([
      Project.findById(task.projectId),
      User.findById(task.userId),
    ]).then(val => {
      task._doc.project = val[0];
      task._doc.user = val[1];
      return res.json(task);
    });*/
  });
}

function reqCreate(req: Request, res: Response) {
  const author = req.user._id;
  const project = req.body.project;
  const name = req.body.name;
  const description = req.body.description || '';
  const assignees = [];
  const links = [];
  const texts = {}; // TODO: extend from project
  const metadata = {}; // TODO: extend from project
  const goals = [];
  const comments = [];
  const tags = req.body.tags || [];
  const history = [];

  if (!author || !project || !name) {
    return res.sendStatus(400);
  }

  const task = new Task({
    author,
    project,
    name,
    description,
    assignees,
    links,
    texts,
    metadata,
    goals,
    comments,
    tags,
    history,
  });

  task.save().then((savedTask: ITask) => res.json(savedTask));
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Task.findById(id).then((task: ITask | null) => {
    if (!task) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  });
}

function reqDelete(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  Task.findByIdAndDelete(id).then(() => {
    return res.sendStatus(200);
  });
}

router.get('/:id', auth, reqGet);
router.post('/', auth, reqCreate);
router.put('/:id', auth, reqUpdate);
router.delete('/:id', auth, reqDelete);
