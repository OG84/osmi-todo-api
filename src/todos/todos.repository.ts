import { Todo, todoCollectionName } from './todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { TodoDto } from './todo.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class TodosRepository {
    constructor(@InjectModel(todoCollectionName) private readonly todoModel: Model<Todo>) {

    }

    findAll(): Observable<TodoDto[]> {
        const findAllPromise = this.todoModel.find().exec();
        return from(findAllPromise).pipe(
            map((x: Todo[]) => x.map(todo => {
                const todoDto: TodoDto = {
                    id: todo._id,
                    name: todo.name
                };
                return todoDto;
            }))
        );
    }

    upsert(todo: TodoDto): Observable<Todo> {
        const upsertPromise = new this.todoModel(todo);
        upsertPromise.save();
        return of(upsertPromise);
    }

    upsertMany(todos: TodoDto[]): Observable<Todo[]> {
        const upsertManyPromise = this.todoModel.insertMany(todos);
        return from(upsertManyPromise);
    }

    delete(todoId: string): void {
        this.todoModel.deleteOne({ _id: todoId });
    }
}