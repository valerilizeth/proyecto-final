const URL_API = 'http://localhost:3000/tasks';

let idtask = ''
let taskArray = [];
const openModalBtn = document.getElementById('open_modal');
const closeModalBtn = document.getElementById('close_modal');

const addBtn = document.querySelector('.btn-save');
const editBtn = document.querySelector('.btn-edit');


const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const authorInput = document.getElementById('author');

const todoList = document.getElementById('todoList');
const deleteBtn = document.querySelector('#deleteButton');

document.addEventListener('DOMContentLoaded',
    function () {
        getTasks();
        addBtn.addEventListener('click', addTask)
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        editBtn.addEventListener('click', updateTaskInfo);
    }
);

function openModal() {
    const modal = document.getElementById('modal');
    editBtn.style.display = 'none';
    addBtn.style.display = 'block';
    modal.style.display = 'flex';
}

function openModalEdit(id) {
    const modal = document.getElementById('modal');
    addBtn.style.display = 'none';
    editBtn.style.display = 'block';
    modal.style.display = 'flex';
    idtask = id;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function changeStateTodo(id, state) {

    const task = taskArray.find((task) => task._id === id);
    if (task.status === state) {
        alert('La tarea ya esta en ese estado');
        return;
    }

    if(task.status === 'completed' && state === 'active'){
        alert('No puedes activar una tarea completada, por favor desmarca la casilla de completado');
        return;
    }
    updateTask(id, state);
}

function getTasks() {
    fetch(URL_API).then((res) => {
        res.json().then((data) => {
            taskArray = data;
            getTotalTasks()
            data.forEach((task) => {
                renderTask(task);
            })
        })
    }).catch((err) => {
        console.log(err);
    })
}

function findTaskAndChangeState(id, stateTask) {
    const task = document.getElementById(id);
    const state = task.querySelector('.todo_list_card_state p');
    const stateDiv = task.querySelector('.todo_list_card_state');
    state.textContent = getParseState(stateTask);
    stateDiv.classList.remove('todo_list_card_state-active');
    stateDiv.classList.remove('todo_list_card_state-completed');
    stateDiv.classList.remove('todo_list_card_state-inactive');
    stateDiv.classList.add(`todo_list_card_state-${stateTask}`);
}

function editTask(id) {
    const task = document.getElementById(id);
    const title = task.querySelector('.todo_list_card_info p');
    const description = task.querySelector('.todo_list_card_info p:nth-child(2)');
    const author = task.querySelector('.todo_list_card_info-author p:nth-child(2)');
    titleInput.value = title.textContent;
    descriptionInput.value = description.textContent;
    authorInput.value = author.textContent;
    openModalEdit(id);
}


function addTask() {
    const title = titleInput.value;
    const description = descriptionInput.value;
    const author = authorInput.value;

    const todoTask = {
        title: title,
        description: description ? description : '',
        author: author ? author : 'Anónimo'
    }

    fetch(URL_API, {
        method: 'POST',
        body: JSON.stringify(todoTask),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        console.log(res);
        res.json().then((data) => {
            renderTask(data);
        })
    }).catch((err) => {
        console.log(err);
    })
}

function updateTask(id, state) {
    fetch(`${URL_API}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: state }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        res.json().then((data) => {
            findTaskAndChangeState(data._id, state);
            taskArray = taskArray.map((task) => {
                if (task._id === data._id) {
                    return data;
                }
                return task;
            })
        })
    }).catch((err) => {
        console.log(err);
    })
}

function updateTaskInfo() {
    const title = titleInput.value;
    const description = descriptionInput.value;
    const author = authorInput.value;

    const task = {
        title: title,
        description: description ? description : '',
        author: author ? author : 'Anónimo'
    }

    fetch(`${URL_API}/${idtask}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        res.json().then((data) => {
            closeModal();
            const task = document.getElementById(data._id);
            const title = task.querySelector('.todo_list_card_info p');
            const description = task.querySelector('.todo_list_card_info p:nth-child(2)');
            const author = task.querySelector('.todo_list_card_info-author p:nth-child(2)');
            title.textContent = data.title;
            description.textContent = data.description;
            author.textContent = data.author;


        })
    }).catch((err) => {
        console.log(err);
    })
}

function deleteTask(id) {
    fetch(`${URL_API}/${id}`, {
        method: 'DELETE'
    }).then((res) => {
        res.json().then((data) => {
            (data);
            const task = document.getElementById(id);
            task.remove();
            taskArray = taskArray.filter((task) => task._id !== id);
            getTotalTasks()
        })
    }).catch((err) => {
        console.log(err);
    })
}


function filterTask() {
    const select = document.getElementById('filter');
    const state = select.value;

    if (state === 'all') {
        getTasks();
        return;
    }

    fetch(`${URL_API}?state=${state}`).then((res) => {
        res.json().then((data) => {
            todoList.innerHTML = '';
            taskArray = data;
            getTotalTasks()
            data.forEach((task) => {
                renderTask(task);
            })
        })
    }).catch((err) => {
        console.log(err);
    })
}

function completeTask(id, state) {
    const inputCheckbox = document.getElementById(`${id}-checkbox`);
    if (inputCheckbox.checked) {
        state = 'completed';
    } else {
        state = 'active';
    }

    const task = taskArray.find((task) => task._id === id);
    const taskState = task.status;
    if (taskState === 'active' || taskState === 'completed') {
        const newState = taskState === 'active' ? 'completed' : 'inactive';
        updateTask(id, newState);
    } else {
        alert('Solo puedes completar tareas activas');
        inputCheckbox.checked = false;
    }
}

function renderTask(task) {
    const taskItem = document.createElement('div');
    
    const previousTask = document.getElementById(task._id);
    if (previousTask) {
        previousTask.remove();
    }
    taskItem.classList.add('todo_list_card');
    taskItem.setAttribute('id', task._id);

    let checked = '';
    if (task.status === 'completed') {
        checked = 'checked';
    }

    const stateParce = getParseState(task.status)

    taskItem.innerHTML = `
    <input type="checkbox" id="${task._id}-checkbox" onchange="completeTask('${task._id}', 'completed')" ${checked} class="custom-checkbox">
    <label for="${task._id}-checkbox" class="custom-label"></label>
        <div class="todo_list_card_info">
            <p class="todo_list_card_info-title">${task.title}</p>
            <p class="todo_list_card_info-description" >${task.description}</p>

            ${task.author === 'Anónimo' ? '' : `
                <div class="todo_list_card_info-author">
                    <p>Responsable:</p>
                    <p>${task.author}</p>
                </div>
    
                
                 `}
        </div>
        <div class="todo_list_card_state todo_list_card_state-${task.status}">
            <p>${stateParce}</p>
        </div> 
        <div class="todo_list_card_actions">
            <i class="fa fa-play play" onclick="changeStateTodo('${task._id}', 'active')"></i>
            <i class="fa fa-edit edit" onclick="editTask('${task._id}')"></i>
            <i class="fa fa-trash trash" onclick="deleteTask('${task._id}')"></i>
        </div>
    `;
    todoList.appendChild(taskItem);
    closeModal();
}

function getTotalTasks() {
    const count = taskArray.length;
    const totalTasks = document.getElementById('totalTasks');
    totalTasks.textContent = count;
}

function getParseState(state) {
    switch (state) {
        case 'active':
            return 'Activa';
        case 'completed':
            return 'Completada';
        case 'inactive':
            return 'Inactiva';
        default:
            return 'Activa';
    }
}
