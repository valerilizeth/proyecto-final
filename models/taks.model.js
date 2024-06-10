const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['inactive', 'active', 'completed'],
        default: 'inactive'
    },
    author: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Task', taskSchema);