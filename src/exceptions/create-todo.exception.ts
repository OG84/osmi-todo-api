import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateTodoException extends HttpException {
    constructor(err: any) {
        super(err, HttpStatus.BAD_REQUEST);
    }
}