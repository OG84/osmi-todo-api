import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateTodoException extends HttpException {
    constructor() {
        super('todo-already-exists', HttpStatus.CONFLICT);
    }
}