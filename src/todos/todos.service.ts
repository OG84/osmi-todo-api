import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Todo } from 'todos/todo.model';

@Injectable()
export class TodosService {
    constructor() {

    }

    getAll(): Observable<Todo[]> {
        return of(this.createDummyTodos());
    }

    private createDummyTodos(): Todo[] {
        return [
            {
                id: '1',
                name: 'List 1'
            },
            {
                id: '2',
                name: 'List 2'
            },
            {
                id: '3',
                name: 'List 3'
            },
            {
                id: '4',
                name: 'List 6'
            }
        ];
    }
}