import { Todo, todoCollectionName } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map, catchError } from 'rxjs/operators';
import { DuplicateTodoException } from 'exceptions/duplicate-todo.exception';

@Injectable()
export class TodosRepository {
    constructor(
        @InjectModel(todoCollectionName) private readonly todoModel: Model<Todo>,
        private readonly logger: Logger) {

    }

    findAll(): Observable<TodoDto[]> {
        const findAllPromise = this.todoModel.find().exec();
        return from(findAllPromise).pipe(
            /*map((x: Todo[]) => x.map(todo => {
                const todoDto: TodoDto = {
                    id: todo._id,
                    name: todo.name
                };
                return todoDto;
            }))*/
        );
    }

    upsert(todo: TodoDto): Observable<Todo> {
        const upsertPromise = new this.todoModel(todo);

        return from(upsertPromise.save()).pipe(
            catchError(err => {
                throw new DuplicateTodoException();
            })
        );
    }

    upsertMany(todos: TodoDto[]): Observable<Todo[]> {
        const upsertManyPromise = this.todoModel.insertMany(todos);
        return from(upsertManyPromise);
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