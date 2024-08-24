<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
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
            width: 300px;
            text-align: center;
        }

        h1 {
            margin-bottom: 20px;
        }

        .input-group {
            display: flex;
            justify-content: space-between;
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

        .task-list {
            list-style: none;
            padding: 0;
            margin-top: 20px;
        }

        .task-item {
            padding: 10px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .task-item:last-child {
            border-bottom: none;
        }

        .complete-button, .delete-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: #007bff;
        }

        .complete-button:hover {
            color: #0056b3;
        }

        .delete-button:hover {
            color: #dc3545;
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
        <ul id="taskList" class="task-list">
            <!-- Список задач будет добавляться сюда -->
        </ul>
    </div>
    <script>
        // Модель задачи
        class Task {
            constructor(title, completed = false) {
                this.title = title;
                this.completed = completed;
            }
        }

        // Модель данных
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

            updateTask(index, updatedTask) {
                this.tasks[index] = updatedTask;
                this.updateLocalStorage();
            }

            updateLocalStorage() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }

            getTasks() {
                return this.tasks;
            }
        }

        // Представление (интерфейс)
        class View {
            constructor() {
                this.taskList = document.getElementById('taskList');
                this.taskInput = document.getElementById('taskInput');
                this.addTaskButton = document.getElementById('addTaskButton');
            }

            displayTasks(tasks) {
                this.taskList.innerHTML = '';

                tasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    li.className = 'task-item';

                    const taskTitle = document.createElement('span');
                    taskTitle.textContent = task.title;
                    if (task.completed) {
                        taskTitle.style.textDecoration = 'line-through';
                    }

                    const completeButton = document.createElement('button');
                    completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
                    completeButton.className = 'complete-button';

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';

                    li.appendChild(taskTitle);
                    li.appendChild(completeButton);
                    li.appendChild(deleteButton);
                    this.taskList.appendChild(li);
                });
            }

            clearInput() {
                this.taskInput.value = '';
            }
        }

        // Контроллер
        class Controller {
            constructor(model, view) {
                this.model = model;
                this.view = view;

                this.view.addTaskButton.addEventListener('click', () => this.addTask());
                this.view.taskList.addEventListener('click', (event) => this.handleTaskActions(event));

                this.view.displayTasks(this.model.getTasks());
            }

            addTask() {
                const taskTitle = this.view.taskInput.value.trim();
                if (taskTitle) {
                    const task = new Task(taskTitle);
                    this.model.addTask(task);
                    this.view.clearInput();
                    this.view.displayTasks(this.model.getTasks());
                }
            }

            handleTaskActions(event) {
                const index = Array.from(this.view.taskList.children).indexOf(event.target.parentElement);

                if (event.target.className === 'complete-button') {
                    const task = this.model.getTasks()[index];
                    task.completed = !task.completed;
                    this.model.updateTask(index, task);
                    this.view.displayTasks(this.model.getTasks());
                }

                if (event.target.className === 'delete-button') {
                    this.model.deleteTask(index);
                    this.view.displayTasks(this.model.getTasks());
                }
            }
        }

        // Запуск приложения
        document.addEventListener('DOMContentLoaded', () => {
            const model = new Model();
            const view = new View();
            const controller = new Controller(model, view);
        });
    </script>
</body>
</html>
