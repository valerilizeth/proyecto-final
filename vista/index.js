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
    console.log(id, state);
    updateTask(id, state);
    console.log('Cambiando estado de la tarea');
}

function getTasks() {
    fetch(URL_API).then((res) => {
        res.json().then((data) => {
            console.log(data);
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

    state.textContent = stateTask;
}

function editTask(id) {
    const task = document.getElementById(id);
    const title = task.querySelector('.todo_list_card_info p');
    const description = task.querySelector('.todo_list_card_info p:nth-child(2)');
    const author = task.querySelector('.todo_list_card_info-author p:nth-child(2)');
    console.log(title.textContent, description.textContent, author.textContent);
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
            console.log(data);
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
        // console.log(res);    
        res.json().then((data) => {
            // console.log(data);
            findTaskAndChangeState(data._id, state);
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
            console.log(data);
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
            console.log(data);
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

    console.log(state);
    fetch(`${URL_API}?state=${state}`).then((res) => {
        res.json().then((data) => {
            console.log(data);
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

    // only change status if the task is active
    const task = document.getElementById(id);
    const taskState = task.querySelector('.todo_list_card_state p');
    if (taskState.textContent === 'active' || taskState.textContent === 'completed') {
        const newState = taskState.textContent === 'active' ? 'completed' : 'inactive';
        updateTask(id, newState);
    } else {
        alert('Solo puedes completar tareas activas');
        inputCheckbox.checked = false;
    }

    // if (state === 'completed') {
    //     inputCheckbox.setAttribute('checked', 'checked');
    //     updateTask(id, state);
    // } else {
    //     inputCheckbox.removeAttribute('checked');
    //     alert('Solo puedes completar tareas activas');
    // }
}

function renderTask(task) {
    const taskItem = document.createElement('div');
    // delete any previous task
    const previousTask = document.getElementById(task._id);
    if (previousTask) {
        previousTask.remove();
    }
    taskItem.classList.add('todo_list_card');
    taskItem.setAttribute('id', task._id);

    // validate if checkbox is checked
    let checked = '';
    if (task.status === 'completed') {
        checked = 'checked';
    }


    taskItem.innerHTML = `
        <input type="checkbox" name="" id="${task._id}-checkbox" onchange="completeTask('${task._id}', 'completed')" ${checked} >
        <div class="todo_list_card_info">
            <p>${task.title}</p>
            <p>${task.description}</p>
            <div class="todo_list_card_info-author">
                <p>Responsable:</p>
                <p>${task.author}</p>
            </div>
        </div>
        <div class="todo_list_card_state">
            <p>${task.status}</p>
        </div> 
        <div class="todo_list_card_actions">
            <i class="fa fa-play" onclick="changeStateTodo('${task._id}', 'active')"></i>
            <i class="fa fa-edit" onclick="editTask('${task._id}')"></i>
            <i class="fa fa-trash" onclick="deleteTask('${task._id}')"></i>
        </div>
    `;
    todoList.appendChild(taskItem);
    closeModal();
}

function getTotalTasks() {
    const count = taskArray.length;
    console.log(count);
    const totalTasks = document.getElementById('totalTasks');
    console.log(totalTasks);
    totalTasks.textContent = count;
}