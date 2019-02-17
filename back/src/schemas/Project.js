const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId:         String,
    name:           String,
    description:    String,
    links:          [{
        name: String,
        description: String,
        url: String,
    }],
    difficulties: [{
        id: String,
        name: String,
    }],
    estimatedTimes: [{
        id: String,
        name: String,
    }],
    priorities: [{
        id: String,
        name: String,
    }],
    types: [{
        id: String,
        name: String,
    }],
    states: [{
        id: String,
        name: String,
    }],
    categories: [{
        id: String,
        name: String,
    }],
    created:        { type: Date, default: Date.now },
    lastUpdated:    { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
