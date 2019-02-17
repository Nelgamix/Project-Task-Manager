const express = require('express');
const Project = require('../schemas/Project');
const User = require('../schemas/User');
const Task = require('../schemas/Task');
const middleware = require('./middleware');
const router = express.Router();

const defaultPriorities = [
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
];

function get(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Project.findById(id).then(project => {
        if (!project) {
            return res.sendStatus(404);
        }

        Promise.all([
            User.findById(project.userId),
            Task.find({projectId: id})
        ]).then((values) => {
            project._doc.user = values[0];
            project._doc.tasks = values[1];
            res.json(project);
        });
    });
}

function create(req, res) {
    const userId = req.body.userId;
    const name = req.body.name;
    const description = req.body.description || '';
    const links = req.body.links || [];
    const difficulties = req.body.difficulties || defaultDifficulties;
    const estimatedTimes = req.body.estimatedTimes || defaultEstimatedTimes;
    const priorities = req.body.priorities || defaultPriorities;
    const types = req.body.types || defaultTypes;
    const states = req.body.states || defaultStates;
    const categories = req.body.categories || defaultCategories;

    if (!userId || !name) {
        return res.sendStatus(400);
    }

    const project = new Project({
        userId,
        name,
        description,
        links,
        difficulties,
        estimatedTimes,
        priorities,
        types,
        states,
        categories,
    });

    project.save().then(() => res.json(project));
}

function update(req, res) {
    const id = req.params.id;
    // Fields changeable
    const name = req.body.name;
    const description = req.body.description;
    const links = req.body.links;
    const difficulties = req.body.difficulties;
    const estimatedTimes = req.body.estimatedTimes;
    const priorities = req.body.priorities;
    const types = req.body.types;
    const states = req.body.states;
    const categories = req.body.categories;

    if (!id) {
        return res.sendStatus(400);
    }

    Project.findById(id).then(project => {
        if (!project) {
            return res.sendStatus(404);
        }

        if (name) project.name = name;
        if (description) project.description = description;
        if (links) project.links = links;
        if (difficulties) project.difficulties = difficulties;
        if (estimatedTimes) project.estimatedTimes = estimatedTimes;
        if (priorities) project.priorities = priorities;
        if (types) project.types = types;
        if (states) project.states = states;
        if (categories) project.categories = categories;
        project.lastUpdated = Date.now();

        project.save().then(() => res.json(project));
    });
}

function fDelete(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    Promise.all([
        Project.findByIdAndDelete(id),
        Task.deleteMany({projectId: id})
    ]).then(() => {
        res.json({});
    })
}

router.get('/:id', middleware.auth, get);
router.post('/', middleware.auth, create);
router.put('/:id', middleware.auth, update);
router.delete('/:id', middleware.auth, fDelete);

module.exports = router;
