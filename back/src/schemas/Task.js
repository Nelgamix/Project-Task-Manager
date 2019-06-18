const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    name: String,
    description: String,
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    links: [{
        id: Number,
        name: String,
        description: String,
        url: String,
    }],
    texts: Schema.Types.Mixed,
    metadata: Schema.Types.Mixed,
    goals: [{
        id: Number,
        name: String,
        done: Boolean,
    }],
    comments: [{
        id: Number,
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        comment: String,
    }],
    tags: [String],
    history: [{
        action: String,
        description: String,
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
    }],
    created: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
