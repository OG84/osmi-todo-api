import { HttpException, HttpStatus } from '@nestjs/common';
import { TodoDto } from 'todos/todo.dto';

export class DuplicateTodoException extends HttpException {
    constructor(todo: TodoDto) {
        super(`Todo with id ${todo._id} or name ${todo.name} already exists`, HttpStatus.CONFLICT);
    }
}