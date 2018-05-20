import { Todo } from 'todos/todo.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class TodosRepository {
    constructor(@InjectModel(Todo.collectionName) private readonly todoModel: Model<Todo>) {

    }

    findAll(): Observable<Todo[]> {
        const findAllPromise = this.todoModel.find().exec();
        return of(findAllPromise);
    }

    upsert(todo: Todo): Observable<Todo> {
        const upsertPromise = new this.todoModel(todo).save();
        return of(upsertPromise);
    }

    upsertMany(todos: Todo[]): Observable<Todo[]> {
        const upsertManyPromise = this.todoModel.insertMany(todos);
        return of(upsertManyPromise);
    }
}