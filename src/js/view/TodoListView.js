class TodoListView {
    constructor(config) {
        this.config = config;
        this.$list = this.generateList();
    }

    generateList() {
        return $(`
            <ul class="list-group js-list"></ul>
        `).click((e) => this.onClickTodo(e));
    }

    generateTodo(todo) {
        const doneClass = todo.completed ? 'done': 'not-done';

        return `
            <li data-id="${todo.id}" class="list-group-item js-item ${doneClass}">${todo.title}</li>
        `;
    }

    renderTodos(todos) {
        const todosHtml = todos.map(this.generateTodo);
        this.$list.html(todosHtml);
    }

    onClickTodo(e) {
        const id = $(e.target).data('id');
        this.config.toggleCompleted(id);
    }
}