import { createProject } from "./project.js";
import { createTodo } from "./todo.js";
import { saveProjects, loadProjects } from './storage.js';

let projects = [];
let currentProject = null;

export function renderTodoUI() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    // ========== INIT STORAGE DATA FIRST ==========
    projects = loadProjects();

    if (projects.length === 0) {
        const work = createProject('Work');
        const personal = createProject('Personal');
        projects.push(work, personal);
    }

    currentProject = projects[0];

    // ========== UI SETUP ==========
    const wrapper = document.createElement('div');
    wrapper.classList.add('todo-wrapper');

    // === Project Add Form ===
    const projectAddWrapper = document.createElement('div');
    projectAddWrapper.classList.add('project-add-wrapper');

    const projectInput = document.createElement('input');
    projectInput.type = 'text';
    projectInput.placeholder = 'New project name';
    projectInput.classList.add('form-input');

    const addProjectBtn = document.createElement('button');
    addProjectBtn.textContent = '+ Add Project';
    addProjectBtn.classList.add('add-task-btn');

    addProjectBtn.addEventListener('click', () => {
        const name = projectInput.value.trim();
        if (!name) return;

        const newProject = createProject(name);
        projects.push(newProject);
        saveProjects(projects);
        refreshProjectDropdown(projectDropdown);
        projectInput.value = '';
    });

    projectAddWrapper.append(projectInput, addProjectBtn);
    wrapper.appendChild(projectAddWrapper);

    // === Project Select Dropdown ===
    const projectDropdown = document.createElement('select');
    projectDropdown.id = 'project-select';
    projectDropdown.classList.add('priority-select');

    const defaultOption = document.createElement('option');
    defaultOption.text = '-- Select Project --';
    defaultOption.disabled = true;
    projectDropdown.appendChild(defaultOption);

    projectDropdown.addEventListener('change', () => {
        currentProject = projects.find(p => p.id === projectDropdown.value);
        renderTodoList(wrapper);
    });

    wrapper.appendChild(projectDropdown);
    refreshProjectDropdown(projectDropdown);
    projectDropdown.value = currentProject?.id;

    // === Task Form ===
    const form = document.createElement('div');
    form.classList.add('todo-form');

    const titleInput = createInput('text', 'Title');
    const descInput = createInput('text', 'Description');
    const dueInput = createInput('date', '');
    const prioritySelect = createSelect(['Low', 'Medium', 'High']);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Task';
    addBtn.classList.add('add-task-btn');

    addBtn.addEventListener('click', () => {
        if (!currentProject) return alert('Select a project first');

        const todo = createTodo(
            titleInput.value.trim(),
            descInput.value.trim(),
            dueInput.value,
            prioritySelect.value
        );

        currentProject.todos.push(todo);
        saveProjects(projects);
        renderTodoList(wrapper);
        clearInputs([titleInput, descInput, dueInput]);
    });

    form.append(titleInput, descInput, dueInput, prioritySelect, addBtn);
    wrapper.appendChild(form);

    // === Task Display ===
    const taskList = document.createElement('div');
    taskList.id = 'todo-list';
    wrapper.appendChild(taskList);

    app.appendChild(wrapper);

    renderTodoList(wrapper);
}

function refreshProjectDropdown(dropdown) {
    dropdown.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.text = '-- Select Project --';
    defaultOption.disabled = true;
    dropdown.appendChild(defaultOption);

    projects.forEach(project => {
        const opt = document.createElement('option');
        opt.value = project.id;
        opt.text = project.name;
        dropdown.appendChild(opt);
    });
}

function renderTodoList(wrapper) {
    const listContainer = wrapper.querySelector('#todo-list');
    listContainer.innerHTML = '';

    if (!currentProject || currentProject.todos.length === 0) {
        listContainer.innerHTML = '<p>No tasks yet.</p>';
        return;
    }

    currentProject.todos.forEach((todo) => {
        const card = document.createElement('div');
        card.classList.add('task-card');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        checkbox.addEventListener('change', () => {
            todo.completed = !todo.completed;
            saveProjects(projects);
            renderTodoList(wrapper);
        });

        const title = document.createElement('span');
        title.textContent = todo.title;
        if (todo.completed) title.style.textDecoration = 'line-through';

        const priority = document.createElement('span');
        priority.textContent = todo.priority;
        priority.classList.add('priority', todo.priority);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => {
            currentProject.todos = currentProject.todos.filter(t => t.id !== todo.id);
            saveProjects(projects);
            renderTodoList(wrapper);
        });

        card.append(checkbox, title, priority, deleteBtn);
        listContainer.appendChild(card);
    });
}

function createInput(type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.classList.add('form-input');
    return input;
}

function createSelect(options) {
    const select = document.createElement('select');
    select.classList.add('priority-select');
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.toLowerCase();
        option.textContent = opt;
        select.appendChild(option);
    });
    return select;
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = '');
}
