import {Router, Request, Response} from 'express';
import {auth} from '../middleware';
import {Task, TaskAssignee, TaskComment, TaskGoal, TaskHistory, TaskLink, TaskModel} from "../../schemas/Task";
import {InstanceType} from "typegoose";

const router = Router();

export default router;

function reqGet(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  TaskModel.findById(id).then((task: InstanceType<Task> | null) => {
    if (!task) {
      return res.sendStatus(404);
    }

    return res.json(task);
  });
}

function reqCreate(req: Request, res: Response) {
  const author = req.user._id;
  const project = req.body.project;
  const name = req.body.name;
  const description = req.body.description || '';
  const assignees: TaskAssignee[] = [];
  const links: TaskLink[] = [];
  const texts = {}; // TODO: extend from project
  const metadata = {}; // TODO: extend from project
  const goals: TaskGoal[] = [];
  const comments: TaskComment[] = [];
  const tags = req.body.tags || [];
  const history: TaskHistory[] = [];

  if (!author || !project || !name) {
    return res.sendStatus(400);
  }

  const task = new TaskModel({
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

  task.save().then((savedTask: InstanceType<Task>) => res.json(savedTask));
}

function reqUpdate(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  TaskModel.findById(id).then((task: InstanceType<Task> | null) => {
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

  TaskModel.findByIdAndDelete(id).then(() => {
    return res.sendStatus(200);
  });
}

router.get('/:id', auth, reqGet);
router.post('/', auth, reqCreate);
router.put('/:id', auth, reqUpdate);
router.delete('/:id', auth, reqDelete);
