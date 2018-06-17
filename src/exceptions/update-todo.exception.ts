import { BadRequestException } from '@nestjs/common';

export class UpdateTodoException extends BadRequestException {
    constructor() {
        super('todo-update-error', 'could-not-update');
    }
}