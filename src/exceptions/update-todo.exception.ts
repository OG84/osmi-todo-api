import { BadRequestException } from '@nestjs/common';

export class UpdateTodoException extends BadRequestException {
    constructor(err: string) {
        super('Could not update todo. ' + err, 'could-not-update');
    }
}