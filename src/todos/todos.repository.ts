import { Todo, todoCollectionName, TodoModel } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of, from, throwError } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
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

    findByParentId(parentId: string): Observable<TodoDto[]> {
        this.logger.log(`findByParentId: ${parentId}`);

        return from(this.todoModel.findByParentId(parentId));
    }

    create(todo: TodoDto): Observable<Todo> {
        this.logger.log(`create: ${JSON.stringify(todo)}`);

        return this.findByParentId(todo.parentId).pipe(
            switchMap(todosWithSameParentId => {
                const nameAlreadyExistsInSiblingTodo = todosWithSameParentId
                    .find(x => x.name === todo.name);

                if (nameAlreadyExistsInSiblingTodo) {
                    throw new DuplicateTodoException(todo);
                }

                return from(this.todoModel.create(todo)).pipe(
                    catchError(err => {
                        this.logger.error(JSON.stringify(err));

                        if (this.isDuplicateKeyError(err)) {
                            throw new DuplicateTodoException(todo);
                        }

                        throw new CreateTodoException();
                    })
                );
            })
        );
    }

    update(todo: TodoDto): Observable<Todo> {
        this.logger.log(`update: ${JSON.stringify(todo)}`);

        return from(this.todoModel.findByIdAndUpdate(todo._id, todo, { new: true })).pipe(
            catchError(x => {
                this.logger.error(x);
                throw new CreateTodoException();
            })
        );
    }

    delete(todoId: string): Observable<Todo> {
        this.logger.log(`delete ${todoId}`);

        return from(this.todoModel.findByIdAndRemove(todoId));
    }

    private isDuplicateKeyError(error: any): boolean {
        return error.name === 'MongoError' && error.code === 11000;
    }
}