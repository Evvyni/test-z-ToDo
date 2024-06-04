
class TaskStorage {
    
    static saveTasks(tasks) {
        const serializedTasks = tasks.map(task => task.serialize());
        localStorage.setItem('tasks', JSON.stringify(serializedTasks));
    }

    static loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            return JSON.parse(savedTasks);
        }
        return [];
    }
}

class Task {
    constructor(title, onComplete, onDelete) {
        this.title = title;
        this.completed = false;
        this.onComplete = onComplete;
        this.onDelete = onDelete;
        
        const storedTask = localStorage.getItem(`task_${this.title}`);
        if (storedTask) {
            const parsedTask = JSON.parse(storedTask);
            this.completed = parsedTask.completed;
        }

        this.element = this.createTaskElement();
    }

    createTaskElement() {
        const task = document.createElement('div');
        task.className = this.completed ? 'task done' : 'task todo';

        const taskTitle = document.createElement('span');
        taskTitle.textContent = this.title;
        task.appendChild(taskTitle);

        if (!this.completed) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const completeButton = this.createButton('<img src="img/check.png">', 'complete', this.onComplete);
            const deleteButton = this.createButton('<img src="img/basket.png">', 'delete', this.onDelete);

            buttonContainer.appendChild(completeButton);
            buttonContainer.appendChild(deleteButton);
            task.appendChild(buttonContainer);
        }

        return task;
    }

    toggleComplete() {
        this.completed = !this.completed;
        this.element.className = this.completed ? 'task done' : 'task todo';
        localStorage.setItem(`task_${this.title}`, JSON.stringify({ completed: this.completed }));

        if (this.completed) {
            const buttonContainer = this.element.querySelector('.button-container');
            if (buttonContainer) {
                buttonContainer.remove();
            }
        }
    }

    createButton(text, className, onClickHandler) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.className = className;
        button.onclick = onClickHandler;
        return button;
    }

    serialize() {
        return {
            title: this.title,
            completed: this.completed
        };
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

        const task = new Task(this.inputField.value, () => this.toggleTaskStatus(task), () => this.deleteTask(task));

        this.TaskContainer.appendChild(task.element);
        this.inputField.value = '';

        this.tasks.push(task);
        this.updateCounts();
        this.saveTasks();
    }

    saveTasks() {
        TaskStorage.saveTasks(this.tasks);
    }

    loadTasks() {
        const tasksData = TaskStorage.loadTasks();
        tasksData.forEach(data => {
            const task = new Task(data.title, () => this.toggleTaskStatus(task), () => this.deleteTask(task));
            task.completed = data.completed;
            task.element.className = task.completed ? 'task done' : 'task todo';
            if (task.completed) {
                this.doneContainer.appendChild(task.element);
            } else {
                this.TaskContainer.appendChild(task.element);
            }
            this.tasks.push(task);
        });
        this.updateCounts();
    }

    toggleTaskStatus(task) {
        task.toggleComplete();
        if (task.completed) {
            this.doneContainer.appendChild(task.element);
        } else {
            this.TaskContainer.appendChild(task.element);
        }
        this.updateCounts();
        this.saveTasks();
    }

    deleteTask(task) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            task.element.remove();
            this.updateCounts();
            this.saveTasks();
        }
    }

    updateCounts() {
        this.TaskNum.textContent = this.TaskContainer.childElementCount;
        this.Done.textContent = this.doneContainer.childElementCount;
    }
    
}

const taskManager = new TaskManager();
