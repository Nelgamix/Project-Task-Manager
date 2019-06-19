const express = require('express');
const Project = require('../schemas/Project');
const User = require('../schemas/User');
const Task = require('../schemas/Task');
const middleware = require('./middleware');
const utils = require('../utils');
const router = express.Router();

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
                value: 0,
            },
            {
                id: 'in-progress',
                name: 'In Progress',
                value: 1,
            },
            {
                id: 'closed',
                name: 'Closed',
                value: 2,
            },
        ]
    },
];

const defaultTexts = [
    {
        id: 'todo',
        name: 'Todo',
        description: '',
        model: '',
    }
];

function reqGet(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Project.findById(id).then(project => {
        if (!project) {
            return res.sendStatus(404);
        }

        return Promise.all([
            User.findById(project.userId),
            Task.find({projectId: id})
        ]).then((values) => {
            project._doc.user = values[0];
            project._doc.tasks = values[1];
            return res.json(project);
        });
    });
}

function reqCreate(req, res) {
    const author = req.user._id;
    const name = req.body.name;
    const description = req.body.description || '';
    const links = req.body.links || [];
    const users = [];
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

const updateObjectModel = {
    canCreate: ['users', 'links', 'texts', 'metadata', 'metadata.*[_id].values'],
    canUpdate: ['name', 'description', 'users.*[user]', 'links.*[_id]', 'metadata.*[_id]', 'metadata.*[_id].values.*[_id]', 'texts.*[_id]'],
    canDelete: ['users.*[user]', 'links.*[_id]', 'texts.*[_id]', 'metadata.*[_id]', 'metadata.*[_id].values.*[_id]'],
};

const updater = new utils.Updater(updateObjectModel);

function reqUpdate(req, res) {
    const id = req.params.id;

    if (!id || !req.body || req.body.length === 0) {
        return res.sendStatus(400);
    }

    Project.findById(id).then(project => {
        if (!project) {
            return res.sendStatus(404);
        }

        let changed = false;
        for (const change of req.body) {
            changed = updater.updateObject(project, change) || changed;
        }

        if (changed) {
            project.lastUpdated = Date.now();
            return project.save().then(() => res.json(project));
        }

        return res.sendStatus(204);
    });
}

function reqDelete(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Promise.all([
        Project.findByIdAndDelete(id),
        Task.deleteMany({project: id})
    ]).then(() => {
        res.json({});
    })
}

router.get('/:id', middleware.auth, reqGet);
router.post('/', middleware.auth, reqCreate);
router.put('/:id', middleware.auth, reqUpdate);
router.delete('/:id', middleware.auth, reqDelete);

module.exports = router;
