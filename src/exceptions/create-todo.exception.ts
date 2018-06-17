import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateTodoException extends HttpException {
    constructor() {
        super('Todo could not be created.', HttpStatus.BAD_REQUEST);
    }
}