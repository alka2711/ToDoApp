document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const clearCompletedButton = document.getElementById('clear-completed');

    taskForm.addEventListener('submit', addTask);
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTask() {
        // Clear the entire taskList
        taskList.innerHTML = '';

        // Add all the tasks present inside the tasks array to taskList
        tasks.forEach((task, indx) => {
            const li = document.createElement('li');
            li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
            `;

            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            taskList.appendChild(li);

            const completeBtn = li.querySelector('.complete-btn');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            completeBtn.addEventListener('click', (ev) => completeTask(indx));
            deleteBtn.addEventListener('click', (ev) => deleteTask(indx));
            editBtn.addEventListener('click', (ev) => editTask(li, indx));
        })
    }

    // Edit Task
    function editTask(li,indx){
        let span=li.firstElementChild;
        // Merko span ki jagah ek input element daalna padega so that user can change the value of
        // text
        const input = document.createElement('input');
        input.type = 'text';
        input.value = li.firstElementChild.innerText;
        li.replaceChild(input,span);
        input.focus();

        input.addEventListener('blur',(ev)=>{
            let updatedTaskValue=input.value.trim();
            console.log(updatedTaskValue);
            if(updatedTaskValue){
                tasks[indx].text=updatedTaskValue;
            }
            saveTask();
            renderTask();
        })
    }

    function completeTask(indx) {
        tasks[indx].completed = !tasks[indx].completed;
        saveTask();
        renderTask();
    }

    function deleteTask(indx) {
        tasks.splice(indx, 1);
        saveTask();
        renderTask();
    }

    function saveTask() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask(e) {
        e.preventDefault(); // This will prevent the page from getting refres
        const task = taskInput.value.trim();
        if (task) {
            tasks.push({
                text: task,
                completed: false
            });

            saveTask();
            renderTask();
        }
    }

    // Clear completed functionality
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTask();
        renderTask();
    }

    clearCompletedButton.addEventListener('click', clearCompleted);

    // Starting mei renderTask ka call hona jarrori  hai taaki,
    // localStorage ke tasks load  ho jaaye frontEnd par
    renderTask();
})