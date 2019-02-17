const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId:         String,
    projectId:      String,
    name:           String,
    description:    String,
    state:          String,
    priority:       String,
    difficulty:     String,
    category:       String,
    type:           String,
    estimatedTime:  String,
    links:          [{
        name: String,
        description: String,
        url: String,
    }],
    todo:           String,
    log:            String,
    tags:           [String],
    created:        { type: Date, default: Date.now },
    lastUpdated:    { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
