import { HttpException, HttpStatus } from '@nestjs/common';

export class TodoNotFoundException extends HttpException {
    constructor(err: any) {
        super(err, HttpStatus.NOT_FOUND);
    }
}