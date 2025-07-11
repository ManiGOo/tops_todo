import { createTodo } from "./todo";

let todos = [];

export function renderStaticUI() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('todo-wrapper');

    // Heading
    const heading = document.createElement('h1');
    heading.textContent = '📝 To-D0 List';

    // Form Layout
    const form = document.createElement('div');
    form.classList.add('todo-form');

    const titleInput = createInput('text', 'Title');
    const descInput = createInput('text', 'Description');
    const dueInput = createInput('date', '');
    const priotitySelect = createSelect(['Low', 'Medium', 'High']);
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Tesk';
    addBtn.classList.add('add-task-btn');


    // Form submit login
    addBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title === '') return;

        const todo = createTodo(
            title,
            descInput.value.trim(),
            dueInput.value,
            priotitySelect.value,
        );

        todos.push(todo);
        renderTodoList(wrapper);
        clearInputs([titleInput, descInput, dueInput]);
    });

    form.append(titleInput, descInput, dueInput, priotitySelect, addBtn);
    wrapper.append(heading, form)

    // Add list Container
    const listContainer = document.createElement('div');
    listContainer.id = 'todo-list';
    wrapper.appendChild(listContainer);

    app.appendChild(wrapper);
}

// Helper function to clear inputs
function clearInputs(inputs) {
    inputs.forEach((input) => (input.value));
}

function createInput(type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.classList.add('form-input');
    return input;
}

// Task Rendering
function renderTodoList(wrapper) {
    const listContainer = wrapper.querySelector('#todo-list');
    listContainer.innerHTML = '';

    if (todos.length === 0) {
        listContainer.innerHTML = '<p>No tasks yet.</p>';
        return;
    }
    todos.forEach((todo) => {
        const card = document.createElement('div');
        card.classList.add('task-card');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todo.completed = !todo.completed;
            renderTodoList(wrapper);
        });

        const title = document.createElement('span')
        title.textContent = todo.title
        if (todo.completed) title.style.textDecoration = 'line-through'

        const priority = document.createElement('span')
        priority.textContent = todo.priority
        priority.classList.add('priority', todo.priority)

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '🗑️'
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter((t) => t.id !== todo.id)
            renderTodoList(wrapper)
        })

        card.append(checkbox, title, priority, deleteBtn)
        listContainer.appendChild(card)
    })
}


// Factory Helper

function createSelect(options) {
    const select = document.createElement('select');
    select.classList.add('priority-select');
    options.forEach(element => {
        const o = document.createElement('option');
        o.value = element.toLowerCase();
        o.textContent = element;
        select.appendChild(o);
    });
    return select;
}