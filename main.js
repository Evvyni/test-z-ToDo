const AddNewTaskButton = document.getElementById('AddNewTaskButton');
const inputField = document.getElementById('inputField');
const TaskContainer = document.getElementById('TaskContainer');
const doneContainer = document.getElementById('doneContainer');
const TaskNum = document.getElementById('TaskNum');
const Done = document.getElementById('Done');

AddNewTaskButton.addEventListener('click', addTask);

function createTaskElement(title) {
    const task = document.createElement('div');
    task.className = 'task todo';

    const taskTitle = document.createElement('span');
    taskTitle.textContent = title;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const completeButton = createButton('<img src="img/check.png">', 'complete', () => moveToDone(task));

    const deleteButton = createButton('<img src="img/basket.png">', 'delete', () => {
        task.remove();
        updateCounts();
    });

    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);

    task.appendChild(taskTitle);
    task.appendChild(buttonContainer);

    return task;
}

function createButton(text, className, onClickHandler) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.className = className;
    button.onclick = onClickHandler;
    return button;
}

function addTask() {
    if (inputField.value.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    const task = createTaskElement(inputField.value);

    TaskContainer.appendChild(task);
    inputField.value = '';

    updateCounts();
}

function moveToDone(task) {
    task.className = 'task done';
    task.querySelector('.complete').remove();
    task.querySelector('.delete').remove();
    
    doneContainer.appendChild(task);
    updateCounts();
}

function updateCounts() {
    TaskNum.textContent = TaskContainer.childElementCount;
    Done.textContent = doneContainer.childElementCount;
}