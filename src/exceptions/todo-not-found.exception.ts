import { HttpException, HttpStatus } from '@nestjs/common';

export class TodoNotFoundException extends HttpException {
    constructor(todoId: string) {
        super(`Could not find todo with id ${todoId}`, HttpStatus.NOT_FOUND);
    }
}