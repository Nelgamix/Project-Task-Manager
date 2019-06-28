const express = require('express');
const Project = require('../schemas/Project');
const User = require('../schemas/User');
const Task = require('../schemas/Task');
const middleware = require('./middleware');
const utils = require('../utils');
const router = express.Router();

const remove = require('lodash/remove');

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

/**
 * Method to get the difference between two arrays.
 * Returns the difference in three arrays:
 *   objectsToCreate
 *   objectsToDelete
 *   objectsToUpdate
 * @param arrayRef
 * @param arrayDiff
 * @param findFn search for element in array. Must return an index. -1 if not found
 * @param updateFn find difference between new and old object.
 */
function diff(arrayRef, arrayDiff, findFn, updateFn) {
    const objectsToCreate = arrayDiff.slice();
    const objectsToDelete = [];
    const objectsToUpdate = [];
    const objectsToUpdateTmp = [];

    let tmp;
    // eg: ref: [1], diff: [1, 2, 3]
    for (const e of arrayRef) {
        tmp = findFn(objectsToCreate, e);
        if (tmp >= 0) {
            objectsToUpdateTmp.push([e, objectsToCreate[tmp]]);
            objectsToCreate.splice(tmp, 1);
        }

        objectsToDelete.push(e);
    }

    let changed;
    for (const objectToUpdate of objectsToUpdateTmp) {
        changed = updateFn(...objectToUpdate);
        if (changed) {
            objectsToUpdate.push(objectToUpdate[0]);
        }
    }

    return [objectsToCreate, objectsToUpdate, objectsToDelete];
}

function updateName(project, name) {
    if (!name) {
        return false;
    }

    project.name = name;

    return true;
}

function updateDescription(project, description) {
    if (!description) {
        return false;
    }

    project.description = description;

    return true;
}

function updateUser(source, update) {
    if (update.right) {
        source.right = update.right;
    }
}

function updateUsers(project, users) {
    if (!users) {
        return false;
    }

    const [usersToCreate, usersToUpdate, usersToDelete] = diff(
      project.users,
      users,
      (arr, elem) => arr.findIndex(e => e.user == elem.user),
      (n, o) => {
          if (n.right !== o.right) {
              return true;
          }
      }
    );

    for (const user of usersToCreate) {
        project.users.push(user);
    }

    for (const user of usersToDelete) {
        remove(project.users, u => u.id == user.id);
    }

    for (const user of usersToUpdate) {
        const us = project.users.find(u => u.id == user.id);
        updateUser(us, user);
    }

    return usersToCreate.length > 0
        || usersToDelete.length > 0
        || usersToUpdate.length > 0;
}

function updateLinks(project, links) {
    if (!links) {
        return false;
    }

    project.links = links;

    return true;
}

function updateMetadata(project, metadata) {
    if (!metadata) {
        return false;
    }

    project.metadata = metadata;

    return true;
}

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

function reqUpdate(req, res) {
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
