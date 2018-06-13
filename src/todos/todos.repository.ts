import { Todo, todoCollectionName } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map, catchError } from 'rxjs/operators';
import { CreateTodoException } from 'exceptions/create-todo.exception';
import { UpdateTodoException } from 'exceptions/update-todo.exception';
import { DuplicateTodoException } from '../exceptions/duplicate-todo.exception';
import { TodoNotFoundException } from '../exceptions/todo-not-found.exception';

@Injectable()
export class TodosRepository {
    constructor(
        @InjectModel(todoCollectionName) private readonly todoModel: Model<Todo>,
        private readonly logger: Logger) {

    }

    findAll(): Observable<TodoDto[]> {
        const findAllPromise = this.todoModel.find().exec();
        return from(findAllPromise);
    }

    findById(id: string): Observable<TodoDto> {
        return Observable.create(observer => {
            this.logger.warn('searching for ' + id);
            this.todoModel.findById(id, (err, res) => {
                if (err) {
                    this.logger.error(err);
                    throw new TodoNotFoundException(err);
                }

                observer.next(res);
                observer.complete();
            });
        }).pipe(
            catchError(err => {
                this.logger.error(err);
                throw new TodoNotFoundException(err);
            })
        );
    }

    update(todo: TodoDto): Observable<Todo> {
        const updateTodo = new this.todoModel(todo);
        return Observable.create(observer => {
            this.todoModel.findByIdAndUpdate(updateTodo._id, updateTodo, { upsert: true, new: true }, (err, res) => {
                if (err) {
                    this.logger.error(err);
                    throw new UpdateTodoException();
                }

                observer.next(updateTodo);
                observer.complete();
            });
        }).pipe(
            catchError(err => {
                this.logger.error(err);
                throw new DuplicateTodoException(err);
            })
        );
    }

    create(todo: TodoDto): Observable<Todo> {
        const newTodo = new this.todoModel(todo);

        return from(newTodo.save()).pipe(
            catchError(err => {
                throw new CreateTodoException(err);
            })
        );
    }

    delete(todoId: string): void {
        const result = this.todoModel.deleteOne({ _id: todoId }, (err) => {
            if (err) {
                this.logger.error(err);
                return;
            }

            this.logger.log(`todo ${todoId} deleted`);
        });
    }
}