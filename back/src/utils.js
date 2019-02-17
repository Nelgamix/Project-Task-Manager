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

module.exports = {
    formatToClient
};
