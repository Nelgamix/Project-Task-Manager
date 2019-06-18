const set = require('lodash/set');
const unset = require('lodash/unset');
const get = require('lodash/get');
const has = require('lodash/has');
const assign = require('lodash/assign');
const remove = require('lodash/remove');

const excludeKeys = ['__v', 'password', '_id'];

function formatToClient(object, additionalObject) {
    const fo = getCleanObject(object);

    if (additionalObject) {
        for (const o of Object.keys(additionalObject)) {
            fo[o] = getCleanObject(additionalObject[o]);
        }
    }

    return fo;
}

function getCleanObject(object) {
    if (object instanceof Array) {
        return object.map(it => getCleanObject(it));
    }

    const o = {};
    const keys = Object.keys(object._doc ? object._doc : object);
    for (const k of keys) {
        if (excludeKeys.indexOf(k) === -1) {
            if (object[k] instanceof Object) {
                o[k] = getCleanObject(object[k]);
            } else {
                o[k] = object[k];
            }
        }
    }
    return o;
}

const UpdateType = Object.freeze({
    Create: 'create',
    Update: 'update',
    Delete: 'delete',
});

const idRegex = /\[([a-z0-9]+)]/g;
class Updater {
    constructor(model) {
        this.setModel(model);
    }

    transformPathIntoRegex(path) {
        // ENTRY: metadata.*[id].values.*[id]
        // OUTPUT: ^metadata\.([a-z0-9]+)\.values\.([a-z0-9]+)$ ; ['id', 'id'] ; 'object'
        const result = {
            regex: undefined,
            path: '',
            propNames: [],
            lastPathType: 'object',
        };

        // Find idnames
        for (const match of [...path.matchAll(idRegex)]) {
            if (!match || match.length < 2) {
                continue;
            }

            result.propNames.push(match[1]);
        }

        // Delete idnames
        result.path = path.replace(idRegex, '');

        // Detect last path type
        result.lastPathType = result.path.endsWith('*') ? 'array' : 'object';

        // Create regex
        result.regex = new RegExp(
            '^' +
            result.path
                .replace(/\*/, '([a-z0-9]+)')
                .replace(/\./, '\.') +
            '$'
        );

        return result;
    }

    compileModelDefinition(modelDefinition) {
        const r = {};

        for (const prop of ['canCreate', 'canUpdate', 'canDelete']) {
            r[prop] = [];
            modelDefinition[prop].forEach(d => r[prop].push(this.transformPathIntoRegex(d)));
        }

        return r;
    }

    findInObject(object, regs, path) {
        if (!has(object, path)) {
            return false;
        }

        for (const reg of regs) {
            if (reg.regex.test(path)) {
                const match = reg.regex.match(path);
                return [reg, match.slice(1)];
            }
        }

        return false;
    }

    setModel(model) {
        this.model = this.compileModelDefinition(model);
    }

    doInObject(object, modelItem, modelValue, operationType, value) {
        let lastObject = object;
        let finalObject = object;
        let arrIdx = 0;
        let propName;
        let propValue;
        let tokens = modelItem.path.split('.');
        let lastToken;

        for (const token in tokens) {
            lastToken = token;
            lastObject = finalObject;

            if (token === '*') {
                propName = modelItem.propNames[arrIdx];
                propValue = modelValue[arrIdx];
                finalObject = finalObject.find(p => p[propName] === propValue);
            } else {
                finalObject = finalObject[token];
            }
        }

        if (operationType === 'update') {
            // We need to set the last Object
            if (modelItem.lastPathType === 'object') {
                set(lastObject, lastToken, value);
            } else if (modelItem.lastPathType === 'array') {
                assign(finalObject, value);
            }
        } else if (operationType === 'create') {
            if (modelItem.lastPathType === 'array') {
                finalObject.push(value);
            }
        } else if (operationType === 'delete') {
            if (modelItem.lastPathType === 'object') {
                unset(finalObject, lastToken);
            } else if (modelItem.lastPathType === 'array') {
                remove(lastObject, p => p[propName] === propValue);
            }
        }

        return finalObject;
    }

    update(object, modelItem, modelValue, value) {
        this.doInObject(object, modelItem, modelValue, 'update', value);
    }

    create(object, modelItem, modelValue, value) {
        this.doInObject(object, modelItem, modelValue, 'create', value);
    }

    delete(object, modelItem, modelValue) {
        this.doInObject(object, modelItem, modelValue, 'delete');
    }

    updateObject(object, change) {
        let updated = false;
        let found;
        let regex;

        switch (change.type) {
            case UpdateType.Create:
                [found, regex] = this.findInObject(object, this.model.canCreate, change.path);
                if (found) {
                    this.update(object, regex, found, change.value);
                    updated = true;
                }
                break;
            case UpdateType.Update:
                [found, regex] = this.findInObject(object, this.model.canUpdate, change.path);
                if (found) {
                    this.create(object, regex, found, change.value);
                    updated = true;
                }
                break;
            case UpdateType.Delete:
                [found, regex] = this.findInObject(object, this.model.canDelete, change.path);
                if (found) {
                    this.delete(object, regex, found);
                    updated = true;
                }
                break;
        }

        return updated;
    }
}

/*
Update schematic:
[
    {
        type: 'Update',
        path: 'description',
        value: 'zqdzq'
    },
    {
        type: 'Update',
        path: 'metadata.7.values.7',
        value: 'zqdzq'
    },
    {
        type: 'Create',
        path: 'metadata.7.values',
        value: {
            id: 'ddd', ...
        }
    },
    {
        type: 'Delete',
        path: 'metadata.7.values.7'
    }
]
 */

module.exports = {
    formatToClient,
    Updater,
    UpdateType,
};
