import { Injectable, Logger } from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '../todos/todo.model';
import { TodosRepository } from './todos.repository';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository) {
        this.createDummyTodos();
    }

    getAll(): Observable<TodoDto[]> {
        return this.todosRepository.findAll();
    }

    upsert(todo: Todo): Observable<Todo> {
        return this.todosRepository.upsert(todo);
    }

    private createDummyTodos(): void {
        const dummyTodos: TodoDto[] = [
            {
                name: 'List 1'
            },
            {
                name: 'List 2'
            },
            {
                name: 'List 3'
            },
            {
                name: 'List 6'
            }
        ];

        this.todosRepository.upsertMany(dummyTodos).pipe(
            catchError(x => {
                // console.log('xxxx hallo');
                return EMPTY;
            })
        );
    }
}