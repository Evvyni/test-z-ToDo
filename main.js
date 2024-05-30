class Task {
    constructor(title, onComplete, onDelete) {
        this.title = title;
        this.onComplete = onComplete;
        this.onDelete = onDelete;
        this.element = this.createTaskElement();
    }

    createTaskElement() {
        const task = document.createElement('div');
        task.className = 'task todo';
        
        const taskTitle = document.createElement('span');
        taskTitle.textContent = this.title;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const completeButton = this.createButton('<img src="img/check.png">', 'complete', this.onComplete);
        const deleteButton = this.createButton('<img src="img/basket.png">', 'delete', this.onDelete);
        
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);
        
        task.appendChild(taskTitle);
        task.appendChild(buttonContainer);
        
        return task;
    }

    createButton(text, className, onClickHandler) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = className;
        button.onclick = onClickHandler;
        return button;
    }
}

class TaskManager {
    constructor() {
        this.AddNewTaskButton = document.getElementById('AddNewTaskButton');
        this.inputField = document.getElementById('inputField');
        this.TaskContainer = document.getElementById('TaskContainer');
        this.doneContainer = document.getElementById('doneContainer');
        this.TaskNum = document.getElementById('TaskNum');
        this.Done = document.getElementById('Done');
        
        this.tasks = [];
        
        this.AddNewTaskButton.addEventListener('click', () => this.addTask());
        this.loadTasks();
        this.updateCounts();
    }

    addTask() {
        if (this.inputField.value.trim() === '') {
            alert('Please enter a task.');
            return;
        }

        const task = new Task(this.inputField.value, () => this.moveToDone(task.element), () => {
            task.element.remove();
            this.updateCounts();
        });

        this.TaskContainer.appendChild(task.element);
        this.inputField.value = '';

        this.tasks.push(task);
        this.updateCounts();
        this.saveTasks();
        this.updateCounts();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks.map(task => task.title)));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const taskTitles = JSON.parse(savedTasks);
            taskTitles.forEach(title => {
                const task = new Task(title, () => this.moveToDone(task.element), () => {
                    task.element.remove();
                    this.updateCounts();
                    this.saveTasks();
                });
                this.tasks.push(task);
                this.TaskContainer.appendChild(task.element);
            });
        }
    }

    moveToDone(taskElement) {
        taskElement.className = 'task done';
        taskElement.querySelector('.complete').remove();
        taskElement.querySelector('.delete').remove();

        this.doneContainer.appendChild(taskElement);
        this.updateCounts();
    }

    updateCounts() {
        this.TaskNum.textContent = this.TaskContainer.childElementCount;
        this.Done.textContent = this.doneContainer.childElementCount;
    }
}

const taskManager = new TaskManager();
