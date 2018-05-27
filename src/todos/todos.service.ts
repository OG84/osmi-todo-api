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
    }

    getAll(): Observable<TodoDto[]> {
        return this.todosRepository.findAll();
    }

    upsert(todo: Todo): Observable<Todo> {
        return this.todosRepository.upsert(todo);
    }

    delete(todoId: string): void {
        this.todosRepository.delete(todoId);
    }
}