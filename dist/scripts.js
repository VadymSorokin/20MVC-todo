$(() => {
    const controller = new TodosController();
})
class TodosController {
    constructor() {
        this.todoListView = new TodoListView({
            toggleCompleted: (id) => this.toggleCompleted(id),
        });
        this.todosModel = new TodosModel();

        const $app = $('.app');

        $app.append(this.todoListView.$list);

        this.init();
    }

    async init() {
        const todos = await this.todosModel.getTodos();
        this.todoListView.renderTodos(todos);
    }

    async toggleCompleted(id) {
        await this.todosModel.toogleCompleted(id);
        this.todoListView.renderTodos(this.todosModel.todos);
    }
}
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
class TodosModel {
    constructor() {
        this.todos = [];
    }

    async getTodos() {
        return fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((todos) => this.todos = todos);
    }

    async toogleCompleted(id) {
        const todo = this.todos.find(todo => todo.id === id);

        const newTodo = {
            ...todo,
            completed: !todo.completed
        };

        return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((newTodo) => {
            this.todos = this.todos.map(todo => {
                if(todo.id !== id) {
                    return todo;
                }

                return newTodo;
            });
        });
    }
}