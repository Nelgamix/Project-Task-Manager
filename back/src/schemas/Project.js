const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String, // Name of the project
    description: String, // Description of the project
    users: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        right: String,
        added: { type: Date, default: Date.now },
    }],
    links: [{
        id: Number,
        name: String,
        description: String,
        url: String,
    }],
    metadata: [{
        id: String,
        name: String,
        description: String,
        values: [{
            id: String,
            name: String,
            value: Number,
        }],
    }],
    texts: [{
        id: String,
        name: String,
        description: String,
        model: String,
    }],
    created: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
