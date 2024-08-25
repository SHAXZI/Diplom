<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Improved Todo List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            text-align: center;
        }

        h1 {
            margin-bottom: 20px;
        }

        .input-group {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        #taskInput {
            flex: 1;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        #addTaskButton {
            padding: 10px;
            font-size: 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
        }

        #addTaskButton:hover {
            background-color: #218838;
        }

        .filter-group {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }

        .filter-group button {
            padding: 10px;
            border: none;
            background-color: #ddd;
            cursor: pointer;
            border-radius: 4px;
        }

        .filter-group button.active {
            background-color: #007bff;
            color: white;
        }

        .task-list {
            list-style: none;
            padding: 0;
        }

        .task-item {
            padding: 10px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }

        .task-item:last-child {
            border-bottom: none;
        }

        .task-item.completed span {
            text-decoration: line-through;
            color: #888;
        }

        .edit-button, .complete-button, .delete-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: #007bff;
            margin-left: 5px;
        }

        .edit-button:hover {
            color: #ffc107;
        }

        .complete-button:hover {
            color: #0056b3;
        }

        .delete-button:hover {
            color: #dc3545;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .modal-content button {
            padding: 10px 20px;
            margin: 10px;
            border: none;
            cursor: pointer;
        }

        .confirm-button {
            background-color: #28a745;
            color: white;
            border-radius: 4px;
        }

        .cancel-button {
            background-color: #dc3545;
            color: white;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Todo List</h1>
        <div class="input-group">
            <input type="text" id="taskInput" placeholder="Enter a new task...">
            <button id="addTaskButton">Add Task</button>
        </div>
        <div class="filter-group">
            <button data-filter="all" class="active">All</button>
            <button data-filter="active">Active</button>
            <button data-filter="completed">Completed</button>
        </div>
        <ul id="taskList" class="task-list"></ul>
    </div>

    <div id="modal" class="modal">
        <div class="modal-content">
            <p>Are you sure you want to delete this task?</p>
            <button id="confirmDelete" class="confirm-button">Yes</button>
            <button id="cancelDelete" class="cancel-button">No</button>
        </div>
    </div>

    <script>
        class Task {
            constructor(title, completed = false) {
                this.title = title;
                this.completed = completed;
            }
        }

        class Model {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            }

            addTask(task) {
                this.tasks.push(task);
                this.updateLocalStorage();
            }

            deleteTask(index) {
                this.tasks.splice(index, 1);
                this.updateLocalStorage();
            }

            toggleTaskCompletion(index) {
                const task = this.tasks[index];
                task.completed = !task.completed;
                this.updateLocalStorage();
            }

            editTask(index, newTitle) {
                const task = this.tasks[index];
                task.title = newTitle;
                this.updateLocalStorage();
            }

            updateLocalStorage() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }

            getTasks(filter = 'all') {
                switch (filter) {
                    case 'active':
                        return this.tasks.filter(task => !task.completed);
                    case 'completed':
                        return this.tasks.filter(task => task.completed);
                    default:
                        return this.tasks;
                }
            }
        }

        class View {
            constructor() {
                this.taskList = document.getElementById('taskList');
                this.taskInput = document.getElementById('taskInput');
                this.addTaskButton = document.getElementById('addTaskButton');
                this.filterButtons = document.querySelectorAll('.filter-group button');
                this.modal = document.getElementById('modal');
                this.confirmDeleteButton = document.getElementById('confirmDelete');
                this.cancelDeleteButton = document.getElementById('cancelDelete');
            }

            displayTasks(tasks) {
                this.taskList.innerHTML = '';

                tasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    li.className = `task-item ${task.completed ? 'completed' : ''}`;

                    const taskTitle = document.createElement('span');
                    taskTitle.textContent = task.title;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.className = 'edit-button';

                    const completeButton = document.createElement('button');
                    completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
                    completeButton.className = 'complete-button';

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';

                    li.appendChild(taskTitle);
                    li.appendChild(editButton);
                    li.appendChild(completeButton);
                    li.appendChild(deleteButton);
                    this.taskList.appendChild(li);

                    editButton.addEventListener('click', () => {
                        const newTitle = prompt('Edit task', task.title);
                        if (newTitle !== null && newTitle.trim() !== '') {
                            this.onEditButtonClick(index, newTitle);
                        }
                    });

                    completeButton.addEventListener('click', () => {
                        this.onCompleteButtonClick(index);
                    });

                    deleteButton.addEventListener('click', () => {
                        this.showModal(index);
                    });
                });
            }

            clearInput() {
                this.taskInput.value = '';
            }

            setFilterButtonActive(button) {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }

            showModal(index) {
                this.modal.style.display = 'flex';
                this.onConfirmDeleteButtonClick(index);
            }

            hideModal() {
                this.modal.style.display = 'none';
            }

            setOnAddTaskButtonClick(handler) {
                this.addTaskButton.addEventListener('click', handler);
            }

            setOnCompleteButtonClick(handler) {
                this.onCompleteButtonClick = handler;
            }

            setOnDeleteButtonClick(handler) {
                this.onDeleteButtonClick = handler;
            }

            setOnEditButtonClick(handler) {
                this.onEditButtonClick = handler;
            }

            setOnFilterButtonClick(handler) {
                this.filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        this.setFilterButtonActive(button);
                        handler(button.dataset.filter);
                    });
                });
            }

            onConfirmDeleteButtonClick(index) {
                this.confirmDeleteButton.onclick = () => {
                    this.onDeleteButtonClick(index);
                    this.hideModal();
                };

                this.cancelDeleteButton.onclick = () => {
                    this.hideModal();
                };
            }
        }

        class Controller {
            constructor(model, view) {
                this.model = model;
                this.view = view;

                this.view.setOnAddTaskButtonClick(this.handleAddTask.bind(this));
                this.view.setOnCompleteButtonClick(this.handleCompleteTask.bind(this));
                this.view.setOnDeleteButtonClick(this.handleDeleteTask.bind(this));
                this.view.setOnEditButtonClick(this.handleEditTask.bind(this));
                this.view.setOnFilterButtonClick(this.handleFilterTasks.bind(this));

                this.displayTasks();
            }

            handleAddTask() {
                const taskTitle = this.view.taskInput.value.trim();
                if (taskTitle) {
                    const task = new Task(taskTitle);
                    this.model.addTask(task);
                    this.displayTasks();
                    this.view.clearInput();
                }
            }

            handleCompleteTask(index) {
                this.model.toggleTaskCompletion(index);
                this.displayTasks();
            }

            handleDeleteTask(index) {
                this.model.deleteTask(index);
                this.displayTasks();
            }

            handleEditTask(index, newTitle) {
                this.model.editTask(index, newTitle);
                this.displayTasks();
            }

            handleFilterTasks(filter) {
                this.displayTasks(filter);
            }

            displayTasks(filter = 'all') {
                const tasks = this.model.getTasks(filter);
                this.view.displayTasks(tasks);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const model = new Model();
            const view = new View();
            const controller = new Controller(model, view);
        });
    </script>
</body>
</html>
