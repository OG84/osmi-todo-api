import { BadRequestException } from '@nestjs/common';

export class CreateTodoException extends BadRequestException {
    constructor(err?: string) {
        super('Todo could not be created. ' + err, 'could-not-create');
    }
}