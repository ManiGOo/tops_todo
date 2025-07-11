export function renderStaticUI() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('todo-wrapper');

    // Heading
    const heading = document.createElement('h1');
    heading.textContent = 'To-D0 List';

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

    form.append(titleInput, descInput, dueInput, priotitySelect, addBtn);

    // Task container Placeholder
    const list = document.createElement('div');
    list.classList.add('task-list');
    list.innerHTML =
        "<div class='task-card placeholder'><input type='checkbox' disabled /> <span>Example Task</span><span class='priority low'>Low</span> <button disabled>🗑️</button></div>";

    wrapper.append(heading, form, list);
    app.appendChild(wrapper)
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
    select.classList.add('priotity-select');
    options.forEach(element => {
        const o = document.createElement('option');
        o.value = element.toLowerCase();
        o.textContent = element;
        select.appendChild(o);
    });
    return select;
}