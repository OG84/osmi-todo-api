import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdateTodoException extends HttpException {
    constructor() {
        super('todo-update-error', HttpStatus.BAD_REQUEST);
    }
}