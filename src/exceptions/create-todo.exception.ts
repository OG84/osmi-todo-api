import { BadRequestException } from '@nestjs/common';

export class CreateTodoException extends BadRequestException {
    constructor() {
        super('Todo could not be created.', 'could-not-create');
    }
}