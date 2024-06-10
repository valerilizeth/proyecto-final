const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const db = require('./db');
const taskModel = require('../models/taks.model');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    connection = db.connection.readyState;
    res.send(connection);
});

app.get('/tasks', (req, res) => {
    if (req.query.state) {
        const state = req.query.state;
        taskModel.find({ status: state }).then((tasks) => {
            res.send(tasks);
        }).catch((err) => {
            res.send(err);
        })
    } else {
        const task = taskModel.find().then((tasks) => {
            res.send(tasks);
        }).catch((err) => {
            res.send(err);
        })
    }
})

// endpoint to create a task
app.post('/tasks', (req, res) => {
    const params = req.body;
    const task = new taskModel(params);
    task.status = 'inactive';
    task.save().then(() => {
        res.send(task);
    }).catch((err) => {
        res.send(err);
    })

})

// get task by id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    taskModel.findById(id).then((task) => {
        res.send(task);
    }).catch((err) => {
        res.send(err);
    })
})

// delete task by id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    taskModel.findByIdAndDelete(id).then(() => {
        // res.send();
        // return json with the deleted task
        res.send({ id });
    }).catch((err) => {
        res.send(err);
    })
})

// update task by id
app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const params = req.body;
    taskModel.findByIdAndUpdate(id, params).then(() => {
        // res.send();
        taskModel.findById(id).then((task) => {
            res.send(task);
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})

app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})


db()