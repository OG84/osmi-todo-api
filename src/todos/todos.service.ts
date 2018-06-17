import { Injectable, Logger } from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Todo } from '../todos/todo.model';
import { TodosRepository } from './todos.repository';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository,
        private readonly logger: Logger) {
    }

    getRoots(): Observable<Todo[]> {
        return this.todosRepository.findRoots();
    }

    getById(id: string): Observable<TodoDto> {
        return this.todosRepository.findById(id);
    }

    upsert(todo: TodoDto): Observable<Todo> {
        return this.todosRepository.upsert(todo);
    }

    delete(todoId: string): Observable<void> {
        return this.todosRepository.delete(todoId);
    }
}