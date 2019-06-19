const express = require('express');
const Schema = require('mongoose').Schema;
const Project = require('../schemas/Project');
const Task = require('../schemas/Task');
const User = require('../schemas/User');
const middleware = require('./middleware');
const utils = require('../utils');
const router = express.Router();

function reqGet(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findById(id).then(task => {
        if (!task) {
            return res.sendStatus(404);
        }

        return Promise.all([
            Project.findById(task.projectId),
            User.findById(task.userId),
        ]).then(val => {
            task._doc.project = val[0];
            task._doc.user = val[1];
            return res.json(task);
        });
    });
}

function reqCreate(req, res) {
    const author = req.user._id;
    const project = new Schema.ObjectId(req.body.project);
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

    task.save().then(() => res.json(task));
}

const updateObjectModel = {
    canCreate: [],
    canUpdate: ['name', 'description'],
    canDelete: [],
};

const updater = new utils.Updater(updateObjectModel);

function reqUpdate(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findById(id).then(task => {
        if (!task) {
            return res.sendStatus(404);
        }

        let changed = false;
        for (const change of req.body) {
            changed = updater.updateObject(task, change) || changed;
        }

        if (changed) {
            task.lastUpdated = Date.now();
            return task.save().then(() => res.json(task));
        }

        return res.sendStatus(204);
    });
}

function reqDelete(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Task.findByIdAndDelete(id).then(() => {
        return res.sendStatus(200);
    });
}

router.get('/:id', middleware.auth, reqGet);
router.post('/', middleware.auth, reqCreate);
router.put('/:id', middleware.auth, reqUpdate);
router.delete('/:id', middleware.auth, reqDelete);

module.exports = router;
