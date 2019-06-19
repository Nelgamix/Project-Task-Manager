const set = require('lodash/set');
const unset = require('lodash/unset');
const assign = require('lodash/assign');
const remove = require('lodash/remove');
const find = require('lodash/find');

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

const idRegex = /\[([_a-zA-Z0-9]+)]/g;
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
        for (const reg of regs) {
            if (reg.regex.test(path)) {
                let match = path.match(reg.regex) || [];
                if (match.length > 1) {
                    match = match.slice(1);
                }
                return [reg, match];
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

        for (const token of tokens) {
            lastToken = token;
            lastObject = finalObject;

            if (token === '*') {
                propName = modelItem.propNames[arrIdx];
                propValue = modelValue[arrIdx];
                // WARNING: do not do a strict equals. We compare Mongoose ObjectId
                // to straight Strings.
                finalObject = find(finalObject, p => p[propName] == propValue);
            } else {
                finalObject = finalObject[token];
            }
        }

        if (operationType === UpdateType.Update) {
            // We need to set the last Object
            if (modelItem.lastPathType === 'object') {
                set(lastObject, lastToken, value);
            } else if (modelItem.lastPathType === 'array') {
                assign(finalObject, value);
            }
        } else if (operationType === UpdateType.Create) {
            // In the case of a create, last object is always
            // an array (we can't create something in an object).
            finalObject.push(value);
        } else if (operationType === UpdateType.Delete) {
            if (modelItem.lastPathType === 'object') {
                unset(finalObject, lastToken);
            } else if (modelItem.lastPathType === 'array') {
                // WARNING: do not do a strict equals. We compare Mongoose ObjectId
                // to straight Strings.
                remove(lastObject, p => p[propName] == propValue);
            }
        }

        return finalObject;
    }

    create(object, modelItem, modelValue, value) {
        this.doInObject(object, modelItem, modelValue, UpdateType.Create, value);
    }

    update(object, modelItem, modelValue, value) {
        this.doInObject(object, modelItem, modelValue, UpdateType.Update, value);
    }

    delete(object, modelItem, modelValue) {
        this.doInObject(object, modelItem, modelValue, UpdateType.Delete);
    }

    updateObject(object, change) {
        let updated = false;
        let result;
        let found;
        let regex;

        const exec = function (model, onFoundFn) {
            result = this.findInObject(object, model, change.path);
            if (!result) {
                return;
            }

            [found, regex] = result;
            if (found) {
                onFoundFn();
                updated = true;
            }
        }

        switch (change.type.toLocaleLowerCase()) {
            case UpdateType.Create:
                exec(this.model.canCreate, () => {
                    this.create(object, found, regex, change.value);
                });
                break;
            case UpdateType.Update:
                exec(this.model.canUpdate, () => {
                    this.update(object, found, regex, change.value);
                });
                break;
            case UpdateType.Delete:
                exec(this.model.canDelete, () => {
                    this.delete(object, found, regex);
                });
                break;
        }

        return updated;
    }
}

/*
Update examples:
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
