import { Injectable, Logger } from '@nestjs/common';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '../todos/todo.model';
import { TodosRepository } from './todos.repository';
import { TodoDto } from './todo.dto';

@Injectable()
export class TodosService {
    constructor(
        private readonly todosRepository: TodosRepository,
        private readonly logger: Logger) {
    }

    getAll(): Observable<TodoDto[]> {
        return this.todosRepository.findAll();
    }

    getById(id: string): Observable<TodoDto> {
        return this.todosRepository.findById(id);
    }

    upsert(todo: TodoDto): Observable<Todo> {

        if (!todo.todos) {
            todo.todos = [];
        }
        this.logger.log(JSON.stringify(todo));

        if (!todo._id) {
            this.logger.log('creating');
            return this.todosRepository.create(todo);
        }

        this.logger.log('updating');
        return this.todosRepository.update(todo);
    }

    delete(todoId: string): void {
        this.todosRepository.delete(todoId);
    }
}