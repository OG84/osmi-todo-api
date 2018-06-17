import { Todo, todoCollectionName, TodoModel } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of, from, throwError } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map, catchError, tap } from 'rxjs/operators';
import { CreateTodoException } from '../exceptions/create-todo.exception';
import { UpdateTodoException } from '../exceptions/update-todo.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';

@Injectable()
export class TodosRepository {
    constructor(
        @InjectModel(todoCollectionName) private readonly todoModel: TodoModel,
        private readonly logger: Logger) {

    }

    findRoots(): Observable<Todo[]> {
        this.logger.log(`findRoots`);

        return from(this.todoModel.findRoots());
    }

    findById(id: string): Observable<TodoDto> {
        this.logger.log(`findById: ${id}`);

        return from(this.todoModel.findById(id)).pipe(
            catchError(x => {
                throw new TodoNotFoundException(id);
            })
        );
    }

    upsert(todo: TodoDto): Observable<Todo> {
        this.logger.log(`upsert: ${JSON.stringify(todo)}`);

        return from(this.todoModel.create(todo)).pipe(
            catchError(x => {
                if (this.isDuplicateKeyError(x)) {
                    throw new DuplicateTodoException(todo);
                }

                throw new CreateTodoException();
            })
        );
    }

    delete(todoId: string): Observable<void> {
        this.logger.log(`delete ${todoId}`);

        return from(this.todoModel.deleteOne({ _id: todoId })).pipe(
            catchError(x => {
                throw new TodoNotFoundException(todoId);
            })
        );
    }

    private isDuplicateKeyError(error: any): boolean {
        return error.name === 'MongoError' && error.code === 11000;
    }
}