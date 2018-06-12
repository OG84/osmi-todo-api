import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateTodoException extends HttpException {
    constructor(err: any) {
        super(err, HttpStatus.CONFLICT);
    }
}