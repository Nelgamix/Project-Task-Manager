const express = require('express');
const Project = require('../schemas/Project');
const Task = require('../schemas/Task');
const User = require('../schemas/User');
const middleware = require('./middleware');
const router = express.Router();

function get(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findById(id).then(task => {
        if (!task) {
            return res.sendStatus(404);
        }

        Promise.all([
            Project.findById(task.projectId),
            User.findById(task.userId),
        ]).then(val => {
            task._doc.project = val[0];
            task._doc.user = val[1];
            res.json(task);
        });
    });
}

function create(req, res) {
    const userId = req.body.userId;
    const projectId = req.body.projectId;
    const name = req.body.name;
    const state = req.body.state;
    const description = req.body.description || '';
    const priority = req.body.priority || '';
    const difficulty = req.body.difficulty || '';
    const category = req.body.category || '';
    const type = req.body.type || '';
    const links = req.body.links || [];
    const estimatedTime = req.body.estimatedTime || '';
    const todo = req.body.todo || '';
    const log = req.body.log || '';
    const tags = req.body.tags || [];

    if (!userId || !projectId || !name || !state) {
        return res.sendStatus(400);
    }

    const task = new Task({
        userId,
        projectId,
        name,
        description,
        priority,
        difficulty,
        category,
        type,
        links,
        estimatedTime,
        todo,
        log,
        state,
        tags,
    });

    task.save().then(() => res.json(task));
}

function update(req, res) {
    const id = req.params.id;
    // Fields changeable
    const name = req.body.name;
    const description = req.body.description;
    const priority = req.body.priority;
    const difficulty = req.body.difficulty;
    const category = req.body.category;
    const type = req.body.type;
    const links = req.body.links;
    const estimatedTime = req.body.estimatedTime;
    const todo = req.body.todo;
    const log = req.body.log;
    const state = req.body.state;
    const tags = req.body.tags;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findById(id).then(task => {
        if (!task) {
            return res.sendStatus(404);
        }

        if (name) task.name = name;
        if (description) task.description = description;
        if (priority) task.priority = priority;
        if (difficulty) task.difficulty = difficulty;
        if (category) task.category = category;
        if (type) task.type = type;
        if (links) task.links = links;
        if (estimatedTime) task.estimatedTime = estimatedTime;
        if (todo) task.todo = todo;
        if (log) task.log = log;
        if (state) task.state = state;
        if (tags) task.tags = tags;
        task.lastUpdated = Date.now();

        Project.findById(task.projectId).then(project => {
            project.lastUpdated = Date.now();

            Promise.all([
                project.save(),
                task.save(),
            ]).then(() => {
                res.json(task);
            });
        })
    });
}

function fDelete(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findByIdAndDelete(id).then(task => {
        res.json(task);
    });
}

router.get('/:id', middleware.auth, get);
router.post('/', middleware.auth, create);
router.put('/:id', middleware.auth, update);
router.delete('/:id', middleware.auth, fDelete);

module.exports = router;
