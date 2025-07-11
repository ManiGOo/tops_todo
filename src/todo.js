export function createTodo(title, description='', dueDate='', priority='low') {
    return {
        id: crypto.randomUUID(),
        title,
        description,
        dueDate,
        priority,
        complete: false,
        creadtedAt: new Date().toISOString(),
    };
};