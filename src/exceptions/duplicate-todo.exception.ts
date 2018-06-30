import { ConflictException } from '@nestjs/common';
import { TodoDto } from 'todos/todo.dto';

export class DuplicateTodoException extends ConflictException {
    constructor(todo: TodoDto) {
        super(`Todo with id ${todo.id} or sibling todo with name ${todo.name} already exists`, 'todo-already-exists');
    }
}