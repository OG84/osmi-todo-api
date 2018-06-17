import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
    constructor(todoId: string) {
        super(`Could not find todo with id ${todoId}`, 'todo-not-found');
    }
}